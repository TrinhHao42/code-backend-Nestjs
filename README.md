<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Gift Shop Backend API - NestJS & TypeORM with PostgreSQL

Dự án cung cấp bộ API RESTful quản lý cửa hàng quà tặng, phân quyền người dùng (User/Admin), tích hợp Swagger UI và Database Migration với PostgreSQL.

---

## Hướng dẫn khởi chạy dự án

### 1. Cài đặt các thư viện (Dependencies)
Tải và cài đặt tất cả các gói thư viện cần thiết:
```bash
npm install
```

### 2. Thiết lập môi trường
Tạo file `.env` ở thư mục gốc của dự án (theo cấu trúc của file `.env.example`).
Sau đó, cấu hình các thông số kết nối Database (PostgreSQL) và JWT_SECRET trong file `.env`.

### 3. Đồng bộ Database & Nạp dữ liệu mẫu (Seed Data)
Để dựng cấu trúc bảng trong PostgreSQL và nạp sẵn dữ liệu vào database, chạy lệnh migration sau:
```bash
npm run migration:run
```

#### Tài khoản thử nghiệm có sẵn sau khi Seed:
* **Tài khoản Admin**:
  * **Email**: `admin@example.com`
  * **Mật khẩu**: `Admin123@`
* **Tài khoản User**:
  * **Email**: `user@example.com`
  * **Mật khẩu**: `User123@`

### 4. Khởi chạy dự án ở chế độ phát triển
Chạy server local:
```bash
npm run start:dev
```

### 5. Truy cập tài liệu API (Swagger UI)
Server chạy trên đường dẫn:
**`http://localhost:3000`**
Truy cập đường dẫn Api-docs:
**`http://localhost:3000/api-docs`**
