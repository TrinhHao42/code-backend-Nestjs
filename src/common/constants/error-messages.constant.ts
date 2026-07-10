export const ErrorMessages = {
  EMAIL_ALREADY_REGISTERED: 'Email này đã được đăng ký sử dụng',
  ADMIN_ACCESS_DENIED: 'Bạn không có quyền truy cập vào khu vực Admin',
  INCORRECT_EMAIL_PASSWORD: 'Email hoặc mật khẩu không chính xác',
  NO_PERMISSION: 'Bạn không có quyền truy cập vào API này',

  USER_NOT_FOUND: 'Không tìm thấy tài khoản người dùng',
  INCORRECT_OLD_PASSWORD: 'Mật khẩu cũ không chính xác',
  INVALID_IMAGE_TYPE: 'Chỉ cho phép tải lên các tệp hình ảnh (jpg, jpeg, png, gif)',
  NO_FILE_UPLOADED: 'Vui lòng chọn tệp hình ảnh để tải lên',

  GIFT_NOT_FOUND_OR_HIDDEN: 'Không tìm thấy quà tặng phù hợp hoặc quà đã bị ẩn',
  GIFT_NOT_FOUND: 'Không tìm thấy quà tặng',
  GIFT_NOT_FOUND_TO_UPDATE: 'Không tìm thấy quà tặng để cập nhật',
  GIFT_NOT_FOUND_TO_DELETE: 'Không tìm thấy quà tặng để xóa',
  INVALID_ACCOUNT: 'Tài khoản không hợp lệ',

  INVALID_PATH_ACCESS: 'Truy cập đường dẫn không hợp lệ',

  GIFT_OUT_OF_STOCK: 'Quà tặng này đã hết hàng',
  INSUFFICIENT_POINTS: 'Bạn không đủ điểm để đổi quà tặng này',
  REDEMPTION_NOT_FOUND: 'Không tìm thấy thông tin giao dịch đổi quà',
  REDEMPTION_ALREADY_CANCELLED: 'Giao dịch đổi quà này đã bị hủy trước đó',
} as const;
