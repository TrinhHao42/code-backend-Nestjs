# Backend Coding Rules & Standards (RULE.md)

Dự án áp dụng bộ quy chuẩn dưới đây để đảm bảo chất lượng mã nguồn, tính nhất quán, hiệu năng và bảo mật. Tất cả các lập trình viên cần tuân thủ nghiêm ngặt các quy tắc này.

---

## 1. Database & TypeORM

* **1.1 Cấu hình kết nối**: Tất cả cấu hình Database (host, port, username, password, database name) phải được đọc từ biến môi trường thông qua `process.env`. Không hardcode thông tin kết nối.
* **1.2 Quản lý Entities & Modules**:
  * Đăng ký cấu hình TypeORM bằng `TypeOrmModule.forRoot(dataSourceOptions)` ở `AppModule`.
  * Khai báo thực thể (`entities`) thông qua `TypeOrmModule.forFeature([Entity])` tại từng Module chức năng tương ứng.
* **1.3 synchronize**: Phải thiết lập `synchronize: false` trong môi trường Production/Staging. Mọi cập nhật cấu trúc cơ sở dữ liệu phải được thực hiện qua các file Migration.
* **1.4 Migrations**:
  * Các thay đổi cấu trúc bảng bắt buộc phải tạo file Migration (`up`/`down`).
  * Có các script chạy và revert rõ ràng trong `package.json` (`migration:run`, `migration:revert`).
* **1.5 Khớp cấu trúc**: Entity và các trường dữ liệu định nghĩa phải khớp hoàn toàn với cấu trúc bảng trong file Migration (tên cột, kiểu dữ liệu, các ràng buộc `nullable`, khóa ngoại, `createdAt`, `updatedAt`).
* **1.6 Seed dữ liệu an toàn**: Các script seed dữ liệu phải đảm bảo tính **Idempotency** (chạy lại nhiều lần không sinh ra dữ liệu trùng lặp). Sử dụng từ khóa `ON CONFLICT DO NOTHING` hoặc kiểm tra sự tồn tại trước khi chèn (`INSERT`).
* **1.7 Phân trang (Pagination)**: Tất cả các API trả về danh sách lớn bắt buộc phải hỗ trợ phân trang chuẩn, trả về metadata bao gồm `total` (tổng số bản ghi) và `totalPages` (tổng số trang).
* **1.8 Tối ưu hóa truy vấn (N+1 Query)**: Tránh truy vấn lặp trong các vòng lặp. Bắt buộc sử dụng `relations` hoặc `join` trong `QueryBuilder` khi cần tải các dữ liệu có quan hệ.

---

## 2. Chức năng Nghiệp vụ & Bảo mật Auth

* **2.1 Đăng nhập User**: Trả về Access Token (JWT) hoặc thiết lập Secure HTTP-Only Cookie khi xác thực thành công.
* **2.2 Đăng nhập Admin**: Tách biệt luồng xử lý hoặc kiểm tra quyền quản trị (`role: 'admin'`) rõ ràng khi đăng nhập hệ thống quản lý.
* **2.3 API Profile**: Các API cá nhân như xem thông tin cá nhân (`profile`), chỉnh sửa thông tin, và đổi mật khẩu bắt buộc phải có `JwtAuthGuard` bảo vệ.
* **2.4 API Quà tặng (User)**: Cho phép xem danh sách quà khả dụng và xem chi tiết quà.
* **2.5 Quản lý Quà tặng (Admin)**: Các API CRUD quà tặng dành cho Admin phải được bảo vệ bởi tổ hợp `JwtAuthGuard` và `RolesGuard(UserRole.ADMIN)`.

---

## 3. Chuẩn NestJS & Khung phát triển

* **3.1 Cấu hình JWT**: Sử dụng `registerAsync` kết hợp cùng `ConfigService` để nạp khóa bí mật và thời hạn sống của Token từ biến môi trường.
* **3.2 Quản lý biến môi trường**: Sử dụng `ConfigModule` và `ConfigService` cho các cấu hình ứng dụng để quản lý tập trung và an toàn.
* **3.3 Validation Global**: Cấu hình `ValidationPipe` toàn cục với các thiết lập:
  ```typescript
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  ```
* **3.4 Tổ chức Module**: Khai báo đầy đủ Controllers và Providers bên trong Feature Module của chúng.
* **3.5 Dependency Injection**: Đảm bảo inject đúng các Repositories, Services, và Guards thông qua Constructor.
* **3.6 Xử lý ngoại lệ (HttpException)**: Sử dụng các Exception có sẵn của NestJS (`ConflictException`, `NotFoundException`, `BadRequestException`, `ForbiddenException`, v.v.) thay vì ném ra lỗi chung `throw new Error()`.

---

## 4. Chuẩn RESTful API & HTTP Response

* **4.1 Quy tắc đặt URL Route**: Sử dụng danh từ số nhiều làm tên resource.
  * *Hợp lệ*: `POST /api/v1/gifts`
  * *Không hợp lệ*: `POST /api/v1/gifts/create` hoặc `POST /api/v1/create-gift`
* **4.2 HTTP Status Code**:
  * `200 OK`: Truy vấn thành công, cập nhật thành công.
  * `201 Created`: Tạo mới resource thành công.
  * `204 No Content`: Xóa thành công (không trả về body).
  * `400 Bad Request`: Lỗi dữ liệu đầu vào hoặc sai thông tin đăng nhập.
  * `401 Unauthorized`: Token không hợp lệ, hết hạn hoặc không được cung cấp.
  * `403 Forbidden`: Không có quyền truy cập (ví dụ: User gọi API Admin).
  * `404 Not Found`: Không tìm thấy resource.
* **4.3 Phản hồi khi tạo**: Khi POST tạo thành công, bắt buộc trả về dữ liệu đối tượng vừa tạo kèm ID.
* **4.4 Danh sách rỗng**: Khi danh sách rỗng, trả về HTTP status `200 OK` cùng mảng rỗng `[]` (Ví dụ: `{ "data": [] }`), không ném ra lỗi `404 Not Found`.
* **4.5 Kiểu dữ liệu tham số**: Route parameter `:id` phải được bọc bởi `ParseUUIDPipe` hoặc `ParseIntPipe` để kiểm soát kiểu dữ liệu.
* **4.6 Bảo mật Đăng nhập**: Sai email hoặc sai mật khẩu đều phải trả về lỗi chung `400 Bad Request` kèm thông báo không phân biệt loại lỗi đăng nhập cụ thể để tránh dò tìm tài khoản. Lỗi `401 Unauthorized` chỉ dùng cho các API yêu cầu xác thực JWT.

---

## 5. Kiến trúc MVC & Cấu trúc Thư mục

* **5.1 Phân tách tầng xử lý**: Controller chỉ điều phối request/response và gọi Service xử lý. Không viết logic nghiệp vụ hay truy vấn DB trực tiếp trong Controller.
* **5.2 entities**: Đặt các class Entity trong thư mục `entities/` riêng biệt.
* **5.3 DTO (Data Transfer Object)**: Sử dụng class-validator cho các request DTO để xác thực dữ liệu đầu vào. Tách biệt rõ ràng giữa Request DTO và Response DTO.
* **5.4 Chuẩn hóa Response**: Tránh trả về trực tiếp thực thể DB (raw entity) cho Client để tránh rò rỉ dữ liệu nhạy cảm. Thực hiện chuyển đổi và format thông qua DTO hoặc Class Serialization.

---

## 6. Bảo mật và Logic Nghiệp vụ

* **6.1 Mã hóa mật khẩu**: Mật khẩu phải được băm (hash) bằng thư viện `bcrypt` trước khi lưu vào DB. Tuyệt đối không trả về trường `password` trong các API phản hồi.
* **6.2 Quản lý Key bí mật**: Khóa bí mật JWT (`JWT_SECRET`) phải đồng nhất ở mọi vị trí cấu hình. Tuyệt đối tránh việc khai báo các fallback key khác nhau trong mã nguồn.
* **6.3 File Upload & Static Paths**: Quản lý đường dẫn tập tin tải lên nhất quán, không lặp prefix đường dẫn và đảm bảo kiểm tra định dạng tập tin.
* **6.4 Kiểm tra định dạng file và dung lượng file**: Khi người dùng upload file, hệ thống phải xác thực xem file có đúng loại được phép và có vượt quá dung lượng tối đa hay không trước khi lưu.
* **6.5 Xóa tập tin vật lý**: Hàm xóa file phải kiểm tra và xử lý chuẩn xác đường dẫn tương đối (có hoặc không có dấu gạch chéo đầu `/`).
* **6.6 User Enumeration**: Không thông báo chi tiết tài khoản tồn tại hay không khi đăng nhập thất bại.

---

## 7. Quy chuẩn đặt tên (Naming Conventions)

* **7.1 PascalCase**: Sử dụng cho Class, Entity, DTO, Module, Controller, Interface.
  * *Ví dụ*: `UsersController`, `CreateGiftDto`, `UserEntity`.
* **7.2 camelCase**: Sử dụng cho tên biến, thuộc tính đối tượng (properties), và tên hàm/phương thức (methods).
  * *Ví dụ*: `pointsRequired`, `isAvailable`, `getProfile()`.
* **7.3 kebab-case**: Sử dụng cho tên tập tin và thư mục.
  * *Ví dụ*: `users.controller.ts`, `update-profile.dto.ts`.
* **7.4 Lỗi chính tả**: Đảm bảo từ ngữ rõ ràng và không viết sai chính tả.

---

## 8. Format & Tooling Quy định

* **8.1 Linter & Formatter**: Sử dụng ESLint để bắt lỗi cú pháp và Prettier để tự động định dạng mã nguồn. Phải chạy lệnh lint và format trước khi commit code.
* **8.2 Ghi nhật ký (Logging)**: Tuyệt đối không sử dụng `console.log` trong code Production. Thay vào đó hãy dùng `Logger` được tích hợp sẵn của NestJS.
* **8.3 Quản lý Import**: Thống nhất cấu trúc import sử dụng relative paths hoặc absolute/path aliases (ví dụ `@common/...`), tránh trộn lẫn cả hai cấu trúc import trong cùng một module.

---

## 9. Quy tắc viết Code Logic (TypeScript & TypeORM)

* **9.1 Code sạch**: Xóa bỏ dead code, code comment thừa, và các import không sử dụng.
* **9.2 Tránh Magic Strings**: Sử dụng `enum` hoặc `const` cho các chuỗi cố định, trạng thái và vai trò người dùng.
* **9.3 Bất đồng bộ (Async/Await)**:
  * Tất cả các hàm trả về Promise phải khai báo kiểu trả về tường minh `Promise<T>`.
  * Đảm bảo sử dụng từ khóa `await` khi gọi các hàm bất đồng bộ để tránh lỗi trôi nổi luồng xử lý.

## 10. Cấu hình ESLint & Prettier mở rộng (Bổ sung thêm)

### Cấu hình Prettier (`.prettierrc`)
Dự án áp dụng bộ định dạng code chuẩn sau:
* **singleQuote: true**: Sử dụng dấu nháy đơn cho chuỗi ký tự.
* **trailingComma: "all"**: Luôn thêm dấu phẩy ở cuối dòng cho các thuộc tính/phần tử mảng nhiều dòng.
* **printWidth: 100**: Giới hạn độ dài tối đa của một dòng là 100 ký tự để dễ đọc.
* **tabWidth: 2**: Sử dụng 2 dấu cách cho một thụt lề (indent).
* **semi: true**: Luôn sử dụng dấu chấm phẩy ở cuối dòng lệnh.
* **endOfLine: "auto"**: Tự động xử lý ký tự xuống dòng phù hợp với từng hệ điều hành.

### Quy tắc ESLint bổ sung (`eslint.config.mjs`)
Dự án kích hoạt và bắt buộc tuân thủ các quy tắc linting dưới đây:
1. **`no-console: "error"`**: Ngăn chặn tuyệt đối việc sử dụng `console.log`, `console.warn` trong mã nguồn. Chỉ cho phép sử dụng NestJS `Logger`.
2. **`@typescript-eslint/no-unused-vars`**: Báo lỗi khi khai báo biến mà không sử dụng.
   * Cấu hình: `["error", { "argsIgnorePattern": "^_" }]` (Cho phép bỏ qua các tham số hàm bắt đầu bằng dấu gạch dưới).
3. **`@typescript-eslint/no-explicit-any: "error"`**: Không được phép sử dụng kiểu `any`. Phải khai báo kiểu cụ thể hoặc dùng `unknown` để đảm bảo an toàn kiểu dữ liệu.
4. **`@typescript-eslint/no-floating-promises: "error"`**: Bắt buộc phải xử lý (ví dụ: dùng `await` hoặc `.catch()`) tất cả các Promise để tránh rò rỉ lỗi bất đồng bộ.
5. **`@typescript-eslint/no-unsafe-argument: "error"`**: Ngăn chặn việc truyền các giá trị không an toàn hoặc không được định kiểu rõ ràng vào hàm.
6. **`@typescript-eslint/no-misused-promises: "error"`**: Ngăn chặn việc truyền một hàm async (trả về Promise) vào những vị trí chỉ chấp nhận hàm đồng bộ thông thường (ví dụ: callback mảng, event handler) để tránh memory leak và lọt exception.
7. **`@typescript-eslint/await-thenable: "error"`**: Báo lỗi nếu dùng `await` trước một giá trị không phải là Promise/Thenable, tránh viết code dư thừa.
8. **`@typescript-eslint/no-unsafe-assignment: "error"`**: Ngăn chặn việc gán một giá trị có kiểu `any` vào các biến hoặc thuộc tính khác.
9. **`@typescript-eslint/no-unsafe-member-access: "error"`**: Ngăn chặn việc truy cập thuộc tính trên một đối tượng kiểu `any` (bắt buộc ép kiểu cụ thể trước khi truy cập).
10. **`no-duplicate-imports: "error"`**: Tránh import trùng lặp từ cùng một thư viện/tập tin ở nhiều dòng khác nhau.
11. **`import/order: "error"`** *(yêu cầu eslint-plugin-import)*: Tự động sắp xếp các dòng import theo thứ tự chuẩn: Thư viện ngoài trước, file nội bộ/nội dung dự án sau, giúp file mã nguồn cực kỳ gọn gàng.
