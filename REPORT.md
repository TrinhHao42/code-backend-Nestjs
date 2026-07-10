# REPORT Review Backend code-backend-Nestjs

- Project: code-backend-Nestjs
- Checklist: RULE.md reference checklist
- Ngày review: 2026-07-10

## Tổng kết nhanh

- **Đạt**: 61/62 tiêu chí
- **Chưa đạt**: 0/62 tiêu chí
- **N/A**: 1/62 tiêu chí

---

## Đánh giá chi tiết

### Mục 1: Database & TypeORM

| STT | Tiêu chí | Trạng thái | Ghi chú & Minh chứng |
| :---: | :--- | :---: | :--- |
| **1.1** | Cấu hình kết nối qua biến môi trường `process.env`, không hardcode, dừng app và báo lỗi nếu thiếu | **🟢 Đạt** | Đọc từ `process.env` và ném ra lỗi `InternalServerErrorException` nếu thiếu trong `typeorm.config.ts`. |
| **1.2** | Sử dụng `TypeOrmModule.forRoot` ở module gốc và `TypeOrmModule.forFeature` ở các module chức năng | **🟢 Đạt** | Đăng ký ở `app.module.ts` và `auth.module.ts`, `users.module.ts`, `gifts.module.ts`. |
| **1.3** | Thiết lập `synchronize: false` trong môi trường Production/Staging | **🟢 Đạt** | Cấu hình `synchronize: false` trong `typeorm.config.ts`. |
| **1.4** | Quản lý thay đổi cấu trúc bảng qua Migration (up/down) và có script run/revert | **🟢 Đạt** | Các file migration trong thư mục `migrations` bao gồm `1783568232903-InitDatabase.ts`, `1783572596375-SeedData.ts`, `1783572596376-AddAvatarToUsers.ts`. Script `migration:run` và `migration:revert` khai báo trong `package.json`. |
| **1.5** | Cấu trúc Entity khớp hoàn toàn với cấu trúc bảng trong file Migration | **🟢 Đạt** | Kiểm tra các trường dữ liệu, kiểu dữ liệu, các ràng buộc `nullable` trong `user.entity.ts` và `gift.entity.ts` đều trùng khớp với các câu lệnh SQL trong file migration tương ứng. |
| **1.6** | Seed dữ liệu an toàn đảm bảo tính Idempotency | **🟢 Đạt** | File seed `1783572596375-SeedData.ts` thực hiện truy vấn kiểm tra sự tồn tại của dữ liệu (bằng `email` cho user và `name` cho gift) trước khi thực hiện chèn dữ liệu mới. |
| **1.7** | Hỗ trợ phân trang chuẩn, trả về metadata bao gồm `total` và `totalPages` | **🟢 Đạt** | API `getGifts` và `getAllGiftsAdmin` trong `gifts.controller.ts` gọi service thực hiện `findAndCount` và tính toán trả về đầy đủ `total`, `totalPages`. |
| **1.8** | Tránh truy vấn lặp N+1 (sử dụng relations/join khi cần lấy dữ liệu quan hệ) | **⚪ N/A** | Hiện tại hệ thống chưa có các quan hệ (relations) phức tạp giữa các thực thể Entity. |

---

### Mục 2: Chức năng Nghiệp vụ & Bảo mật Auth

| STT | Tiêu chí | Trạng thái | Ghi chú & Minh chứng |
| :---: | :--- | :---: | :--- |
| **2.1** | Đăng nhập User trả về Access Token (JWT) hoặc HTTP-Only Cookie khi thành công | **🟢 Đạt** | Phương thức `login` trong `auth.controller.ts` và `auth.service.ts` trả về `accessToken`. |
| **2.2** | Đăng nhập Admin tách biệt luồng xử lý hoặc kiểm tra quyền quản trị (`role: 'admin'`) rõ ràng | **🟢 Đạt** | Route `admin/login` trong `auth.controller.ts` gọi `adminLogin` trong `auth.service.ts` để kiểm tra vai trò admin trước khi phát hành token. |
| **2.3** | Các API Profile bảo vệ bởi `JwtAuthGuard` | **🟢 Đạt** | Các API trong `users.controller.ts` như `getProfile`, `updateProfile`, `changePassword` và `uploadAvatar` đều được bảo vệ bằng `@UseGuards(JwtAuthGuard)`. |
| **2.4** | API quà tặng cho User (xem danh sách quà, xem chi tiết) | **🟢 Đạt** | Định nghĩa đầy đủ route `GET /api/v1/gifts` và `GET /api/v1/gifts/:id` trong `gifts.controller.ts`. |
| **2.5** | Quản lý quà tặng dành cho Admin (CRUD) được bảo vệ bởi `JwtAuthGuard` và `RolesGuard(UserRole.ADMIN)` | **🟢 Đạt** | Các route `admin/gifts` trong `gifts.controller.ts` đều được bảo vệ chặt chẽ bởi `JwtAuthGuard`, `RolesGuard` và `@Roles(UserRole.ADMIN)`. |

---

### Mục 3: Chuẩn NestJS & Khung phát triển

| STT | Tiêu chí | Trạng thái | Ghi chú & Minh chứng |
| :---: | :--- | :---: | :--- |
| **3.1** | Cấu hình JWT dùng `registerAsync` nạp từ biến môi trường thông qua `ConfigService`, báo lỗi nếu thiếu | **🟢 Đạt** | Cấu hình trong `auth.module.ts` dùng `JwtModule.registerAsync` và `ConfigService`. Ném ra `InternalServerErrorException` nếu thiếu tham số môi trường và kiểm tra số hợp lệ để tránh lỗi `NaN`. |
| **3.2** | Quản lý biến môi trường tập trung bằng `ConfigModule` và `ConfigService` | **🟢 Đạt** | Đăng ký `ConfigModule.forRoot({ isGlobal: true })` trong `app.module.ts`. |
| **3.3** | Cấu hình `ValidationPipe` toàn cục với `whitelist`, `transform`, `forbidNonWhitelisted` | **🟢 Đạt** | Thiết lập toàn cục đầy đủ các option trên tại `main.ts`. |
| **3.4** | Khai báo đầy đủ Controllers và Providers bên trong Feature Module của chúng | **🟢 Đạt** | Các controller/service được đăng ký chính xác trong `auth.module.ts`, `users.module.ts` và `gifts.module.ts`. |
| **3.5** | Dependency Injection đúng chuẩn thông qua Constructor | **🟢 Đạt** | Thực hiện tiêm (inject) các repositories, services, và guards qua constructor tại các file controller/service. |
| **3.6** | Sử dụng các Exception có sẵn của NestJS (HttpException) thay vì `throw new Error()` | **🟢 Đạt** | Các file xử lý đã sử dụng `BadRequestException`, `NotFoundException`, `ConflictException`, `ForbiddenException` và `InternalServerErrorException`. Không còn hàm nào sử dụng `throw new Error()`. |

---

### Mục 4: Chuẩn RESTful API & HTTP Response

| STT | Tiêu chí | Trạng thái | Ghi chú & Minh chứng |
| :---: | :--- | :---: | :--- |
| **4.1** | Đặt URL Route dùng danh từ số nhiều cho resource và không lồng ghép động từ hành động | **🟢 Đạt** | Sử dụng `/api/v1/gifts` và `/api/v1/admin/gifts` thay vì lồng ghép `/create` hay `/update` vào path. |
| **4.2** | Trả về đúng HTTP Status Code theo chuẩn REST | **🟢 Đạt** | Trả về `201` khi tạo thành công (`createGift`), `204` khi xóa thành công (`deleteGift` với `@HttpCode(HttpStatus.NO_CONTENT)`), `400` cho lỗi đầu vào, `401` cho xác thực, `403` khi sai quyền và `404` khi không tìm thấy. |
| **4.3** | Response POST tạo thành công trả về dữ liệu đối tượng kèm ID | **🟢 Đạt** | API `createGift` trả về DTO đối tượng `GiftResponseDto` chứa `id` vừa được tạo. |
| **4.4** | Danh sách rỗng trả về HTTP status `200 OK` cùng mảng rỗng `[]` | **🟢 Đạt** | Khi không có quà tặng, API vẫn trả về mã trạng thái `200 OK` kèm mảng rỗng trong thuộc tính `data`. |
| **4.5** | Route parameter `:id` được bọc bởi `ParseUUIDPipe` hoặc `ParseIntPipe` | **🟢 Đạt** | Các API chi tiết/cập nhật/xóa quà tặng tại `gifts.controller.ts` đều sử dụng `ParseUUIDPipe` cho tham số `id`. |
| **4.6** | Sai email hoặc mật khẩu đều trả lỗi chung `400 Bad Request` và thông báo không phân biệt loại lỗi đăng nhập | **🟢 Đạt** | Phương thức `validateUser` trong `auth.service.ts` ném ra `BadRequestException` với thông điệp chung `INCORRECT_EMAIL_PASSWORD` từ `error-messages.constant.ts`. |

---

### Mục 5: Kiến trúc MVC & Cấu trúc Thư mục

| STT | Tiêu chí | Trạng thái | Ghi chú & Minh chứng |
| :---: | :--- | :---: | :--- |
| **5.1** | Phân tách tầng xử lý: Controller chỉ điều phối request/response, không viết logic nghiệp vụ hay DB trực tiếp | **🟢 Đạt** | Các controller như `gifts.controller.ts` và `users.controller.ts` chỉ tiếp nhận tham số, gọi service xử lý và thực hiện định dạng dữ liệu trả về thông qua DTO. |
| **5.2** | Đặt các class Entity trong thư mục `entities/` riêng biệt | **🟢 Đạt** | Entity được tổ chức tại `src/modules/users/entities/user.entity.ts` và `src/modules/gifts/entities/gift.entity.ts`. |
| **5.3** | Sử dụng class-validator cho các request DTO, tách biệt Request DTO và Response DTO | **🟢 Đạt** | Định nghĩa các request DTO sử dụng decorators của `class-validator` và các response DTO riêng biệt như `UserResponseDto` và `GiftResponseDto`. |
| **5.4** | Tránh trả về trực tiếp thực thể DB, sử dụng DTO hoặc Class Serialization | **🟢 Đạt** | Sử dụng `plainToInstance` với cấu hình `{ excludeExtraneousValues: true }` để chuyển đổi sang `UserResponseDto` và `GiftResponseDto` trước khi trả về Client. |

---

### Mục 6: Bảo mật và Logic Nghiệp vụ

| STT | Tiêu chí | Trạng thái | Ghi chú & Minh chứng |
| :---: | :--- | :---: | :--- |
| **6.1** | Mật khẩu băm bằng `bcrypt` trước khi lưu, không trả về trường `password` | **🟢 Đạt** | Mã hóa mật khẩu khi đăng ký hoặc đổi mật khẩu trong `auth.service.ts` và `users.service.ts`. Trường `password` được cấu hình ẩn trong entity (`select: false`) và bị loại trừ khi map qua DTO. |
| **6.2** | Khóa bí mật JWT (`JWT_SECRET`) được lấy từ biến môi trường một cách an toàn, không fallback | **🟢 Đạt** | Lấy qua `ConfigService` trong `auth.module.ts`, báo lỗi và dừng chương trình ngay nếu thiếu cấu hình. |
| **6.3** | Quản lý đường dẫn tập tin tải lên nhất quán, tránh trùng lặp prefix đường dẫn | **🟢 Đạt** | Hàm helper `getUploadPath` trong `file-helper.ts` tạo ra định dạng đường dẫn nhất quán bắt đầu bằng `/uploads`. |
| **6.4** | Xác thực định dạng file và dung lượng tối đa khi upload file | **🟢 Đạt** | `UsersController` cấu hình file filter chỉ cho phép đuôi ảnh (`jpg`, `jpeg`, `png`, `gif`) và giới hạn dung lượng tải lên tối đa là 2MB. |
| **6.5** | Hàm xóa file vật lý xử lý chính xác đường dẫn tương đối có hoặc không có dấu `/` và chống path traversal | **🟢 Đạt** | Hàm `deleteFile` trong `file-helper.ts` loại bỏ dấu gạch chéo ở đầu và kiểm tra xem đường dẫn tệp tin thực tế có nằm trong phạm vi thư mục `public` bằng cách sử dụng `startsWith` để chống tấn công Path Traversal. |
| **6.6** | Tránh rò rỉ thông tin người dùng (User Enumeration) khi đăng nhập thất bại | **🟢 Đạt** | Sử dụng thông điệp lỗi đăng nhập chung giống nhau cho cả trường hợp sai email lẫn sai mật khẩu. |

---

### Mục 7: Quy chuẩn đặt tên (Naming Conventions)

| STT | Tiêu chí | Trạng thái | Ghi chú & Minh chứng |
| :---: | :--- | :---: | :--- |
| **7.1** | Sử dụng PascalCase cho Class, Entity, DTO, Module, Controller, Interface | **🟢 Đạt** | Tuân thủ chính xác tại tất cả các tệp tin trong toàn bộ thư mục `src`. |
| **7.2** | Sử dụng camelCase cho biến, thuộc tính đối tượng và tên hàm/phương thức | **🟢 Đạt** | Tuân thủ đúng chuẩn, ví dụ: `pointsRequired`, `isAvailable`, `getProfile()`. |
| **7.3** | Sử dụng kebab-case cho tên tập tin và thư mục | **🟢 Đạt** | Tên tập tin được định dạng theo cấu trúc ví dụ: `users.controller.ts`, `file-helper.ts`. |
| **7.4** | Không viết sai chính tả | **🟢 Đạt** | Đã soát xét, các tên hàm, biến và định nghĩa từ ngữ chính xác, không phát hiện lỗi chính tả. |

---

### Mục 8: Format & Tooling Quy định

| STT | Tiêu chí | Trạng thái | Ghi chú & Minh chứng |
| :---: | :--- | :---: | :--- |
| **8.1** | Sử dụng ESLint và Prettier để tự động định dạng và bắt lỗi, có các script lint/format | **🟢 Đạt** | Dự án có tệp cấu hình `eslint.config.mjs`, `.prettierrc` và định nghĩa các script `lint` và `format` trong `package.json`. |
| **8.2** | Không sử dụng `console.log` trong code Production | **🟢 Đạt** | Sử dụng `Logger` tích hợp của NestJS để ghi nhật ký, ví dụ ghi nhận lỗi bootstrap trong `main.ts`. |
| **8.3** | Thống nhất cấu trúc import (sử dụng relative paths hoặc absolute/path aliases, tránh trộn lẫn) | **🟢 Đạt** | Sử dụng relative paths đồng nhất trong các tệp mã nguồn. |

---

### Mục 9: Quy tắc viết Code Logic (TypeScript & TypeORM)

| STT | Tiêu chí | Trạng thái | Ghi chú & Minh chứng |
| :---: | :--- | :---: | :--- |
| **9.1** | Code sạch: xóa bỏ dead code, comment thừa, import không sử dụng | **🟢 Đạt** | Mã nguồn sạch sẽ, các import không sử dụng đã được dọn dẹp nhờ ESLint kiểm tra nghiêm ngặt. |
| **9.2** | Tránh Magic Strings: Sử dụng enum hoặc constant cho các chuỗi cố định | **🟢 Đạt** | Các thông điệp lỗi được gom tập trung vào hằng số `ErrorMessages` tại tệp `error-messages.constant.ts`, vai trò người dùng quản lý bởi enum `UserRole`. |
| **9.3** | Async/Await nhất quán, khai báo kiểu trả về Promise tường minh và có await đầy đủ | **🟢 Đạt** | Các hàm bất đồng bộ được định nghĩa kiểu trả về `Promise<T>` rõ ràng và sử dụng `await` đầy đủ để tránh trôi nổi luồng xử lý. |

---

### Mục 10: Cấu hình ESLint & Prettier mở rộng (Bổ sung thêm)

#### Cấu hình Prettier (`.prettierrc`)

| STT | Tiêu chí | Trạng thái | Ghi chú & Minh chứng |
| :---: | :--- | :---: | :--- |
| **10.1.1** | `singleQuote: true` (Dùng nháy đơn) | **🟢 Đạt** | Khai báo trong `.prettierrc` và phần plugin prettier của `eslint.config.mjs`. |
| **10.1.2** | `trailingComma: "all"` (Dấu phẩy cuối mảng/thuộc tính nhiều dòng) | **🟢 Đạt** | Khai báo trong `.prettierrc` và phần plugin prettier của `eslint.config.mjs`. |
| **10.1.3** | `printWidth: 100` (Độ rộng tối đa dòng là 100 ký tự) | **🟢 Đạt** | Khai báo trong `.prettierrc` và phần plugin prettier của `eslint.config.mjs`. |
| **10.1.4** | `tabWidth: 2` (Độ rộng thụt dòng 2 spaces) | **🟢 Đạt** | Khai báo trong `.prettierrc` và phần plugin prettier của `eslint.config.mjs`. |
| **10.1.5** | `semi: true` (Luôn có dấu chấm phẩy) | **🟢 Đạt** | Khai báo trong `.prettierrc` và phần plugin prettier của `eslint.config.mjs`. |
| **10.1.6** | `endOfLine: "auto"` (Tự động xuống dòng theo hệ điều hành) | **🟢 Đạt** | Khai báo trong `.prettierrc` và phần plugin prettier của `eslint.config.mjs`. |

#### Quy tắc ESLint bổ sung (`eslint.config.mjs`)

| STT | Tiêu chí | Trạng thái | Ghi chú & Minh chứng |
| :---: | :--- | :---: | :--- |
| **10.2.1** | `no-console: "error"` (Ngăn chặn console.log/console.warn) | **🟢 Đạt** | Khai báo rule `'no-console': 'error'` trong `eslint.config.mjs`. |
| **10.2.2** | `@typescript-eslint/no-unused-vars` (Báo lỗi khai báo biến không dùng) | **🟢 Đạt** | Khai báo rule `'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]` trong `eslint.config.mjs`. |
| **10.2.3** | `@typescript-eslint/no-explicit-any: "error"` (Cấm dùng kiểu any) | **🟢 Đạt** | Khai báo rule `'@typescript-eslint/no-explicit-any': 'error'` trong `eslint.config.mjs`. |
| **10.2.4** | `@typescript-eslint/no-floating-promises: "error"` (Bắt buộc xử lý Promise) | **🟢 Đạt** | Khai báo rule `'@typescript-eslint/no-floating-promises': 'error'` trong `eslint.config.mjs`. |
| **10.2.5** | `@typescript-eslint/no-unsafe-argument: "error"` (Ngăn truyền tham số unsafe) | **🟢 Đạt** | Khai báo rule `'@typescript-eslint/no-unsafe-argument': 'error'` trong `eslint.config.mjs`. |
| **10.2.6** | `@typescript-eslint/no-misused-promises: "error"` (Cấm truyền async promise sai vị trí) | **🟢 Đạt** | Khai báo rule `'@typescript-eslint/no-misused-promises': 'error'` trong `eslint.config.mjs`. |
| **10.2.7** | `@typescript-eslint/await-thenable: "error"` (Cấm dùng await trước giá trị phi Promise) | **🟢 Đạt** | Khai báo rule `'@typescript-eslint/await-thenable': 'error'` trong `eslint.config.mjs`. |
| **10.2.8** | `@typescript-eslint/no-unsafe-assignment: "error"` (Cấm gán giá trị any vào biến) | **🟢 Đạt** | Khai báo rule `'@typescript-eslint/no-unsafe-assignment': 'error'` trong `eslint.config.mjs`. |
| **10.2.9** | `@typescript-eslint/no-unsafe-member-access: "error"` (Cấm truy cập thuộc tính của any) | **🟢 Đạt** | Khai báo rule `'@typescript-eslint/no-unsafe-member-access': 'error'` trong `eslint.config.mjs`. |
| **10.2.10**| `no-duplicate-imports: "error"` (Tránh import trùng lặp cùng tệp/thư viện) | **🟢 Đạt** | Khai báo rule `'no-duplicate-imports': 'error'` trong `eslint.config.mjs`. |
| **10.2.11**| `import/order: "error"` (Sắp xếp các dòng import tự động theo chuẩn) | **🟢 Đạt** | Khai báo rule `'import/order': ['error', ...]` trong `eslint.config.mjs`. |

---

## Đề xuất chỉnh sửa ưu tiên

1. **Thêm API Quản lý User (Admin)**: Mặc dù dự án đã triển khai đầy đủ bảo mật JWT và phân quyền Admin/User, nhưng hiện tại chưa có các API CRUD quản lý người dùng dành cho Admin (như vô hiệu hóa tài khoản, cập nhật thông tin người dùng từ phía Admin). Nên bổ sung các route này để tăng tính hoàn thiện của hệ thống quản lý.
2. **Cấu hình thêm quan hệ giữa các thực thể**: Hiện tại thực thể `User` và `Gift` hoạt động độc lập (chưa có liên kết đổi quà, lưu lịch sử giao dịch). Việc thiết lập các quan hệ `OneToMany` / `ManyToOne` sẽ nâng cao tính thực tế của ứng dụng.
