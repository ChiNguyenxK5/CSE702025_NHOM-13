-- Tạo database nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS pizza_store;

-- Sử dụng database
USE pizza_store;

-- Xóa các bảng nếu đã tồn tại (đúng thứ tự phụ thuộc)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Tạo bảng users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng products (thêm trường type để phân loại)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    base VARCHAR(255),
    topping VARCHAR(255),
    sauce VARCHAR(255),
    type ENUM('hot', 'discount') DEFAULT 'hot', -- hot: bán chạy, discount: khuyến mãi
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng orders
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tạo bảng order_items
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Thêm tài khoản admin mặc định
INSERT INTO users (email, password, role) VALUES 
(
  'admin@gmail.com',
  'admin', -- bcrypt hash of 'admin123'
  'admin'
);

-- Thêm sản phẩm bán chạy (type = 'hot')
INSERT INTO products (name, description, price, image_url, base, topping, sauce, type)
VALUES
('Pizza Ngập Phô Mai Hảo Hạng',
 'Pizza Ngập Phô Mai Hảo Hạng - Sự kết hợp hoàn hảo của 5 loại phô mai cao cấp: Mozzarella, Cheddar, Parmesan, Phô mai dê và Phô mai xanh. Lớp phô mai béo ngậy, kéo sợi quyến rũ hòa quyện với đế bánh giòn rụm, tạo nên hương vị đặc trưng khó cưỡng.',
 175000,
 '/CSE702025_NHOM-13/webHTML-master/uploads/pizza2.jpg',
 'Đế mỏng giòn đặc biệt, được nướng trong lò củi truyền thống',
 'Phô mai Mozzarella, Cheddar, Parmesan, Phô mai dê, Phô mai xanh',
 'Sốt cà chua Ý thượng hạng',
 'hot'),

('Pizza Núi Lửa Phô Mai Xúc Xích Ý',
 'Pizza Núi Lửa Phô Mai Xúc Xích Ý - Tuyệt phẩm với lớp phô mai Mozzarella tan chảy, xúc xích Ý thơm nồng, ớt chuông và nấm tươi. Hương vị cay nồng của ớt hòa quyện cùng vị béo của phô mai tạo nên trải nghiệm ẩm thực độc đáo.',
 305000,
 '/CSE702025_NHOM-13/webHTML-master/uploads/pizza1.jpg',
 'Đế dày mềm kiểu New York',
 'Xúc xích Ý, phô mai Mozzarella, ớt chuông, nấm, hành tây',
 'Sốt cà chua cay đặc biệt',
 'hot'),

('Pizza Topping Bò và Tôm Kiểu Mỹ',
 'Pizza Topping Bò và Tôm Kiểu Mỹ - Sự kết hợp độc đáo giữa thịt bò Úc thượng hạng và tôm sú tươi...',
 235000,
 '/CSE702025_NHOM-13/webHTML-master/uploads/pizza3.jpg',
 'Đế vừa kiểu Chicago',
 'Thịt bò Úc, tôm sú, nấm, hành tây, ớt chuông',
 'Sốt BBQ và sốt mayonnaise',
 'hot'),

('Pizza Hải Sản Sốt Pesto Kem',
 'Pizza Hải Sản Sốt Pesto Kem - Hương vị biển cả với hải sản tươi ngon...',
 225000,
 '/CSE702025_NHOM-13/webHTML-master/uploads/pizza4.png',
 'Đế mỏng giòn kiểu Ý',
 'Tôm, mực, sò điệp, nấm, hành tây, ớt chuông',
 'Sốt Pesto kem đặc biệt',
 'hot'),

('Pizza Rau Củ Thập Cẩm',
 'Pizza Rau Củ Thập Cẩm - Lựa chọn tuyệt vời cho người ăn chay với rau củ tươi...',
 155000,
 '/CSE702025_NHOM-13/webHTML-master/uploads/pizza8.jpg',
 'Đế giòn vừa kiểu Địa Trung Hải',
 'Nấm, ớt chuông, cà chua, hành tây, oliu đen, bắp ngọt',
 'Sốt cà chua hữu cơ',
 'hot'),

('Pizza Gà Phô Mai Thịt Heo Xông Khói',
 'Pizza Gà Phô Mai Thịt Heo Xông Khói - Thịt gà mềm ngọt, heo xông khói giòn thơm...',
 175000,
 '/CSE702025_NHOM-13/webHTML-master/uploads/pizza5.jpg',
 'Đế dày kiểu American',
 'Thịt gà, thịt heo xông khói, phô mai Mozzarella, hành tây, nấm',
 'Sốt BBQ đặc biệt',
 'hot'),

('Pizza Hải Sản Xốt Kim Quất',
 'Pizza Hải Sản Xốt Kim Quất - Hương vị chua ngọt từ xốt kim quất tự nhiên...',
 215000,
 '/CSE702025_NHOM-13/webHTML-master/uploads/pizza6.jpg',
 'Đế mỏng giòn truyền thống',
 'Tôm, mực, cá hồi, rau thơm Việt Nam',
 'Xốt kim quất đặc biệt',
 'hot'),

('Pizza Bơ Gơ Bò Mỹ Sốt Phô Mai',
 'Pizza Bơ Gơ Bò Mỹ Sốt Phô Mai - Thịt bò Mỹ xay, phô mai Cheddar, cà chua, hành tây...',
 205000,
 '/CSE702025_NHOM-13/webHTML-master/uploads/pizza7.jpg',
 'Đế dày mềm kiểu Detroit',
 'Thịt bò Mỹ xay, phô mai Cheddar, cà chua, hành tây, dưa chuột muối',
 'Sốt phô mai đặc biệt và sốt burger',
 'hot'),

('Pizza Dăm Bông Dứa Kiểu Hawaii',
 'Pizza Dăm Bông Dứa Kiểu Hawaii - Dăm bông, dứa tươi, phô mai Mozzarella...',
 175000,
 '/CSE702025_NHOM-13/webHTML-master/uploads/pizza9.jpg',
 'Đế vừa kiểu Hawaii',
 'Dăm bông cao cấp, dứa tươi, phô mai Mozzarella',
 'Sốt cà chua ngọt đặc biệt',
 'hot'),

('Pizza 5 Loại Thịt Thượng Hạng',
 'Pizza 5 Loại Thịt Thượng Hạng - Pepperoni, xúc xích Ý, thịt bò, thịt heo xông khói, gà nướng...',
 205000,
 '/CSE702025_NHOM-13/webHTML-master/uploads/pizza10.jpg',
 'Đế dày kiểu Roma',
 'Pepperoni, xúc xích Ý, thịt bò, thịt heo xông khói, gà nướng, phô mai Mozzarella',
 'Sốt cà chua đặc biệt và sốt BBQ',
 'hot');

-- Thêm sản phẩm combo khuyến mãi (type = 'discount')
INSERT INTO products (name, description, price, image_url, base, topping, sauce, type)
VALUES
('Pizza NewYork size khổng lồ',
 'Pizza size lớn đặc biệt NewYork',
 249500,
 '/CSE702025_NHOM-13/webHTML-master/uploads/pizzauudai1.jpg',
 'Đế dày kiểu Roma',
 'Pepperoni, xúc xích Ý, thịt bò, thịt heo xông khói, gà nướng, phô mai Mozzarella',
 'Sốt cà chua đặc biệt và sốt BBQ',
 'discount'),

('Càng đông càng ngon',
 'Combo dành cho nhóm đông người',
 279000,
 '/CSE702025_NHOM-13/webHTML-master/uploads/pizzauudai2.jpg',
 'Đế vừa kiểu Hawaii',
 'Dăm bông cao cấp, dứa tươi, phô mai Mozzarella',
 'Sốt cà chua ngọt đặc biệt',
 'discount'),

('Gà nướng qua lò ngũ vị',
 'Gà nướng ngũ vị hấp dẫn',
 89000,
 '/CSE702025_NHOM-13/webHTML-master/uploads/pizzauudai3.jpg',
 'Gà tươi',
 'Gà, rau thơm,...',
 'Sốt thượng hạng',
 'discount'),

('Tiết kiệm 50% khi mua pizza thứ 2',
 'Mua pizza thứ 2 giảm 50%',
 250000,
 '/CSE702025_NHOM-13/webHTML-master/uploads/pizzauudai4.jpg',
 'Đế mỏng giòn truyền thống',
 'Tôm, mực, cá hồi, rau thơm Việt Nam',
 'Xốt kim quất đặc biệt',
 'discount'),

('Mỳ ý ở đây ngon VIBE',
 'Mỳ Ý đặc biệt',
 89000,
 '/CSE702025_NHOM-13/webHTML-master/uploads/pizzauudai5.png',
 'Mỳ đa cấp độ',
 'Mỳ, cà chua, bò,...',
 'Sốt thượng hạng',
 'discount');
 
