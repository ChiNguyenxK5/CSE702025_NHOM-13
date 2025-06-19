# 🍕 Pizza Store - Website Bán Pizza Online

## 👥 Nhóm phát triển

**Nhóm 13 - CSE702025**
- Thành viên 1: Đỗ Tiến Sĩ - 23010577
- Thành viên 2: Nguyễn Mạnh Chí - 23010713
- Thành viên 3: Bùi Anh Tuấn - 23010590
## 📋 Mô tả dự án

Pizza Store là một website bán pizza online được phát triển với giao diện hiện đại và thân thiện với người dùng. Website cung cấp đầy đủ các chức năng từ đăng ký, đăng nhập, xem sản phẩm, đặt hàng đến quản lý hệ thống cho admin.

## ✨ Tính năng chính

### 👥 Người dùng thường
- **Đăng ký/Đăng nhập**: Hệ thống xác thực an toàn với JWT
- **Xem sản phẩm**: Danh sách pizza với hình ảnh, mô tả và giá cả
- **Tìm kiếm sản phẩm**: Tìm kiếm theo tên, loại sản phẩm
- **Xem chi tiết sản phẩm**: Thông tin chi tiết về từng loại pizza
- **Giỏ hàng**: Thêm, xóa, cập nhật số lượng sản phẩm
- **Đặt hàng**: Quy trình đặt hàng đơn giản và nhanh chóng
- **Theo dõi đơn hàng**: Xem trạng thái đơn hàng của mình

### 🔧 Quản trị viên (Admin)
- **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm
- **Quản lý đơn hàng**: Xem danh sách đơn hàng, cập nhật trạng thái
- **Quản lý người dùng**: Xem danh sách khách hàng
- **Thống kê**: Dashboard với các thông tin tổng quan

## 🛠️ Công nghệ sử dụng

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MySQL**: Hệ quản trị cơ sở dữ liệu
- **JWT (JSON Web Token)**: Xác thực và phân quyền
- **bcrypt**: Mã hóa mật khẩu
- **multer**: Upload file
- **cors**: Cross-origin resource sharing

### Frontend
- **HTML5**: Cấu trúc trang web
- **CSS3**: Styling và responsive design
- **JavaScript (ES6+)**: Logic tương tác
- **Tailwind CSS**: Framework CSS cho admin panel
- **Font Awesome**: Icon library

### Database
- **MySQL**: Cơ sở dữ liệu quan hệ
- **Các bảng chính**:
  - `users`: Thông tin người dùng
  - `products`: Thông tin sản phẩm
  - `orders`: Đơn hàng
  - `order_items`: Chi tiết đơn hàng

## 📁 Cấu trúc dự án

```
webHTML-master/
├── css/
│   └── style.css              # Stylesheet chính
├── js/
│   ├── server.js              # Server Node.js
│   ├── db.js                  # Kết nối database
│   ├── database.sql           # Schema database
│   ├── login.js               # Logic đăng nhập
│   └── slide.js               # Logic slider
├── uploads/                   # Thư mục chứa hình ảnh
├── index.html                 # Trang chủ
├── admin.html                 # Trang quản trị
├── products.html              # Trang quản lý sản phẩm
├── package.json               # Dependencies
└── package-lock.json          # Lock file
```

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js (version 14 trở lên)
- MySQL (version 8.0 trở lên)
- npm hoặc yarn

### Bước 1: Clone dự án
```bash
git clone <repository-url>
cd CSE702025_NHOM-13/webHTML-master
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình database
1. Tạo database MySQL mới
2. Import file `js/database.sql` vào MySQL
3. Cập nhật thông tin kết nối trong `js/db.js`:

```javascript
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'pizza_store'
});
```

### Bước 4: Khởi chạy server
```bash
node js/server.js
```

### Bước 5: Truy cập website
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3000/api

## 🔐 Tài khoản mặc định

### Admin
- **Email**: admin@gmail.com
- **Password**: admin

## 📡 API Endpoints

### Authentication
- `POST /api/signup` - Đăng ký tài khoản
- `POST /api/login` - Đăng nhập
- `GET /api/admin` - Kiểm tra quyền admin

### Products
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Thêm sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm

### Orders
- `GET /api/orders` - Lấy danh sách đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng

## 🎨 Giao diện

### Trang chủ
- Header với navigation và giỏ hàng
- Banner slider giới thiệu sản phẩm
- Danh sách sản phẩm nổi bật
- Footer với thông tin liên hệ

### Trang Admin
- Sidebar navigation
- Dashboard tổng quan
- Quản lý sản phẩm với CRUD operations
- Quản lý đơn hàng với trạng thái

## 🔒 Bảo mật

- **Mã hóa mật khẩu**: Sử dụng bcrypt với salt rounds
- **JWT Authentication**: Token-based authentication
- **Input validation**: Kiểm tra dữ liệu đầu vào
- **SQL Injection Protection**: Sử dụng prepared statements
- **CORS Configuration**: Cấu hình cross-origin requests

## 🚀 Tính năng nổi bật

1. **Giao diện hiện đại**: Thiết kế đẹp mắt, dễ sử dụng
2. **Hệ thống đăng nhập an toàn**: JWT + bcrypt
3. **Quản lý sản phẩm linh hoạt**: CRUD operations đầy đủ
4. **Giỏ hàng thông minh**: Lưu trữ local storage
5. **Quản lý đơn hàng**: Theo dõi trạng thái real-time
6. **Upload hình ảnh**: Hỗ trợ upload ảnh sản phẩm
7. **Responsive**: Tương thích mọi thiết bị

## 📄 License
Dự án này được phát triển cho mục đích học tập và nghiên cứu.

## 📞 Liên hệ

Nếu có bất kỳ câu hỏi hoặc góp ý nào, vui lòng liên hệ:
- Email: 23010713@st.phenikaa-uni.edu.vn
- GitHub: https://github.com/ChiNguyenxK5

---

**Lưu ý**: Đây là dự án demo, vui lòng cập nhật thông tin liên hệ và tên thành viên nhóm trước khi sử dụng. 
