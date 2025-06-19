const mysql = require('mysql');

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "CSDL2021",
    database: "pizza_store",
    port: 3306
});

// Kết nối đến database
db.connect((err) => {
    if (err) {
        console.error('❌ Lỗi kết nối MySQL:', err);
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('Database pizza_store không tồn tại. Vui lòng chạy file database.sql để tạo database.');
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Sai thông tin đăng nhập MySQL. Vui lòng kiểm tra user và password.');
        }
        return;
    }
    console.log(' Đã kết nối thành công đến MySQL');
});

// Hàm tìm user theo email
const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        if (!email) {
            reject(new Error('Email không được để trống'));
            return;
        }

        const query = 'SELECT * FROM users WHERE email = ?';
        db.query(query, [email], (err, results) => {
            if (err) {
                console.error('Lỗi truy vấn findUserByEmail:', err);
                reject(err);
                return;
            }
            resolve(results[0]);
        });
    });
};

// Hàm tạo user mới
const createUser = (email, hashedPassword) => {
    return new Promise((resolve, reject) => {
        if (!email || !hashedPassword) {
            reject(new Error('Email và mật khẩu không được để trống'));
            return;
        }

        const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.query(query, [email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Lỗi truy vấn createUser:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    reject(new Error('Email đã tồn tại'));
                    return;
                }
                reject(err);
                return;
            }
            resolve(result);
        });
    });
};

// Hàm cập nhật mật khẩu
const updatePassword = (userId, hashedPassword) => {
    return new Promise((resolve, reject) => {
        if (!userId || !hashedPassword) {
            reject(new Error('UserId và mật khẩu mới không được để trống'));
            return;
        }

        const query = 'UPDATE users SET password = ? WHERE id = ?';
        db.query(query, [hashedPassword, userId], (err, result) => {
            if (err) {
                console.error('Lỗi truy vấn updatePassword:', err);
                reject(err);
                return;
            }
            if (result.affectedRows === 0) {
                reject(new Error('Không tìm thấy user'));
                return;
            }
            resolve(result);
        });
    });
};

// Hàm kiểm tra kết nối database
const checkDatabaseConnection = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT 1', (err, results) => {
            if (err) {
                console.error('Lỗi kiểm tra kết nối database:', err);
                reject(err);
                return;
            }
            resolve(true);
        });
    });
};

// Export các hàm để sử dụng ở file khác
module.exports = {
    db,
    findUserByEmail,
    createUser,
    updatePassword,
    checkDatabaseConnection
};
