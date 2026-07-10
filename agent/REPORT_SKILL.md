---
name: reviewer_fixer
description: Standard guidelines and patterns to review and fix code quality, structure, security, and standards for any backend project.
---

# Backend Review & Refactoring Skill

This skill provides a reusable, comprehensive framework to review, validate, and automatically fix backend projects. Use this guide as a baseline standard for all backend repositories.

When generating the review report (`REPORT.md`), you must strictly adhere to the following structure and format.

### Quy tắc quan trọng về liên kết file:
- **Tên file thô (basename)**: Khi trích xuất hoặc đề cập đến bất kỳ file nào trong dự án, chỉ hiển thị tên file thô (basename) dưới dạng văn bản thường (plain text). **Tuyệt đối không sử dụng định dạng liên kết Markdown `[filename](path)` hay `[filename](file:///...)`** để tránh hiển thị đường dẫn đầy đủ trên giao diện.
  - **Ví dụ đúng**: users.controller.ts
  - **Ví dụ sai**: `src/users.controller.ts` hoặc `[users.controller.ts](src/users.controller.ts)` hoặc `[users.controller.ts](file:///...)`

---

## CẤU TRÚC FILE REPORT.md BẮT BUỘC

File `REPORT.md` được tạo ra phải tuân thủ định dạng sau:

```markdown
# REPORT Review Backend [project_name]

- Project: [project_name]
- Checklist: [review-file] reference checklist
- Ngày review: [YYYY-MM-DD]

## Tổng kết nhanh

- Đạt: X/TOTAL tiêu chí
- Chưa đạt: Y/TOTAL tiêu chí
- N/A: Z/TOTAL tiêu chí

## Đánh giá chi tiết 
Đọc file [review-file] và sau đó đánh giá Project theo từng tiêu chí chi tiết.
Tất cả các tiêu chí phụ (bao gồm cả các cấu hình Prettier và quy tắc ESLint riêng lẻ) phải được liệt kê đầy đủ thành từng dòng độc lập.
Mỗi mục lớn trong file [review-file] phải được tách riêng thành một bảng đánh giá tương ứng:

Mục 1: [Tên mục 1]
| # | Tiêu chí | Đạt / Chưa / N/A | Ghi chú |
|---|---|---|---|
| 1.1 | [Tiêu chí 1.1] | | |

Mục 2: [Tên mục 2]
| # | Tiêu chí | Đạt / Chưa / N/A | Ghi chú |
|---|---|---|---|
| 2.1 | [Tiêu chí 2.1] | | |

## Đề xuất chỉnh sửa ưu tiên

1. [Đề xuất ưu tiên 1]
2. [Đề xuất ưu tiên 2]
```