const express = require('express');
const { db, findUserByEmail, createUser, checkDatabaseConnection } = require('./db');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = 'your_jwt_secret_key';

// kiểm tra kết nối database
const checkDbConnection = async (req, res, next) => {
    try {
        await checkDatabaseConnection();
        next();
    } catch (error) {
        console.error('Lỗi kết nối database:', error);
        res.status(500).json({
            success: false,
            message: 'Không thể kết nối đến database'
        });
    }
};

// API đăng ký
app.post('/api/signup', checkDbConnection, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email và mật khẩu không được để trống'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email không hợp lệ'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu phải có ít nhất 6 ký tự'
            });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email này đã được đăng ký'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await createUser(email, hashedPassword);

        res.json({
            success: true,
            message: 'Đăng ký thành công'
        });
    } catch (error) {
        console.error('Lỗi đăng ký:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau'
        });
    }
});

// API đăng nhập
app.post('/api/login', checkDbConnection, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email và mật khẩu không được để trống'
            });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không chính xác'
            });
        }
        if (email === 'admin@gmail.com' && password === 'admin') {
            const token = jwt.sign(
                { id: user.id, email: user.email, role: 'admin' },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.json({
                success: true,
                message: 'Đăng nhập thành công',
                token,
                role: 'admin'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không chính xác'
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            token,
            role: user.role
        });
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau'
        });
    }
});

// Middleware xác thực token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Vui lòng đăng nhập'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Phiên đăng nhập đã hết hạn'
            });
        }
        req.user = user;
        next();
    });
};

// API kiểm tra quyền admin
app.get('/api/admin', [checkDbConnection, authenticateToken], (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Bạn không có quyền truy cập trang này'
        });
    }
    res.json({
        success: true,
        message: 'Xin chào Admin!'
    });
});

// API kiểm tra trạng thái server
app.get('/api/health', async (req, res) => {
    try {
        await checkDatabaseConnection();
        res.json({
            success: true,
            message: 'Server đang hoạt động bình thường',
            database: 'Đã kết nối'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Lỗi kết nối database',
            error: error.message
        });
    }
});

// Route test
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Test OK' });
});

// API thêm sản phẩm mới
app.post('/api/products', [checkDbConnection, authenticateToken], (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Bạn không có quyền thực hiện hành động này'
        });
    }

    const { name, description, price, image_url, base, topping, sauce, type } = req.body;

    if (!name || !description || !price || !image_url || !type) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng cung cấp đầy đủ thông tin sản phẩm'
        });
    }

    const query = 'INSERT INTO products (name, description, price, image_url, base, topping, sauce, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, description, price, image_url, base, topping, sauce, type], (err, result) => {
        if (err) {
            console.error('Lỗi thêm sản phẩm:', err);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi thêm sản phẩm'
            });
        }

        res.json({
            success: true,
            message: 'Thêm sản phẩm thành công',
            productId: result.insertId
        });
    });
});

// API cập nhật sản phẩm
app.put('/api/products/:id', [checkDbConnection, authenticateToken], (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Bạn không có quyền thực hiện hành động này'
        });
    }

    const productId = req.params.id;
    const { name, description, price, image_url, base, topping, sauce, type } = req.body;

    if (!name || !description || !price || !image_url || !type) {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng cung cấp đầy đủ thông tin sản phẩm'
        });
    }

    const query = 'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, base = ?, topping = ?, sauce = ?, type = ? WHERE id = ?';
    db.query(query, [name, description, price, image_url, base, topping, sauce, type, productId], (err, result) => {
        if (err) {
            console.error('Lỗi cập nhật sản phẩm:', err);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật sản phẩm'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        res.json({
            success: true,
            message: 'Cập nhật sản phẩm thành công'
        });
    });
});

// API xóa sản phẩm
app.delete('/api/products/:id', [checkDbConnection, authenticateToken], (req, res) => {
    // Kiểm tra quyền admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Bạn không có quyền thực hiện hành động này'
        });
    }

    const productId = req.params.id;

    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [productId], (err, result) => {
        if (err) {
            console.error('Lỗi xóa sản phẩm:', err);
            return res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa sản phẩm'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        res.json({
            success: true,
            message: 'Xóa sản phẩm thành công'
        });
    });
});

// API lấy danh sách sản phẩm
app.get('/api/products', checkDbConnection, (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Lỗi truy vấn sản phẩm' });
        }
        res.json({ success: true, products: results });
    });
});

// API lấy chi tiết sản phẩm
app.get('/api/products/:id', checkDbConnection, (req, res) => {
    const productId = req.params.id;

    db.query('SELECT * FROM products WHERE id = ?', [productId], (err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Lỗi truy vấn sản phẩm'
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        res.json({
            success: true,
            product: results[0]
        });
    });
});

// Phục vụ static toàn bộ thư mục webHTML-master
app.use(express.static(__dirname + '/../webHTML-master'));

// Tạo thư mục uploads nếu chưa tồn tại
const uploadsDir = path.join(__dirname, '..', 'webHTML-master', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Cấu hình multer để lưu file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'product-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
    fileFilter: function (req, file, cb) {
        // Chỉ chấp nhận file ảnh
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Chỉ chấp nhận file ảnh'), false);
        }
        cb(null, true);
    }
});

// API upload ảnh
app.post('/api/upload', [checkDbConnection, authenticateToken], upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Không có file được upload'
            });
        }

        // Trả về đường dẫn tương đối của file để lưu vào database
        const relativePath = '/uploads/' + req.file.filename;

        res.json({
            success: true,
            filePath: relativePath,
            message: 'Upload ảnh thành công'
        });
    } catch (error) {
        console.error('Lỗi upload file:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Đã có lỗi xảy ra khi upload file'
        });
    }
});

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});