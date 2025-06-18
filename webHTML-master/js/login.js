const showPopupBtn = document.querySelector(".login-btn");
const formPopup = document.querySelector(".form-popup");
const hidePopupBtn = formPopup.querySelector(".close-btn");
const blurBgOverlay = document.querySelector(".blur-bg-overlay");
const signupLoginLink = formPopup.querySelectorAll(".bottom-link a");

// Hiện popup khi nhấn nút login
showPopupBtn.addEventListener("click", () => {
    document.body.classList.add("show-popup");
});

// Ẩn popup khi nhấn nút close hoặc nền mờ (chỉ khi đã đăng nhập)
[hidePopupBtn, blurBgOverlay].forEach(btn => {
    btn.addEventListener("click", () => {
        if (localStorage.getItem('token')) {
            document.body.classList.remove("show-popup");
        }
    });
});

// Chuyển đổi giữa login/signup
signupLoginLink.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        formPopup.classList[link.id === 'signup-link' ? 'add' : 'remove']("show-signup");
    });
});

// Xử lý form đăng nhập
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Đăng nhập thành công!');
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('userEmail', email);
                document.body.classList.remove("show-popup");
                document.body.classList.add("logged-in");
                document.querySelector('.user-info').textContent = `Xin chào, ${email}`;

                // Nếu là admin → chuyển hướng
                if (data.role === 'admin') {
                    window.location.href = 'admin.html';
                }
            } else {
                alert('Sai tài khoản hoặc mật khẩu');
            }
        })
        .catch(() => alert('Lỗi kết nối server!'));
});

// Xử lý form đăng ký
const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const terms = document.getElementById('policy').checked;

    if (!terms) {
        alert('Vui lòng đồng ý với Điều khoản và Điều kiện');
        return;
    }

    fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Đăng ký thành công! Vui lòng đăng nhập.');
                formPopup.classList.remove("show-signup");
                document.getElementById('login-email').value = email;
            } else {
                alert(data.message || 'Đăng ký thất bại');
            }
        })
        .catch(() => alert('Lỗi kết nối server!'));
});
