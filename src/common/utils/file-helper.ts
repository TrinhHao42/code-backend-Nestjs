import { existsSync, unlinkSync, mkdirSync } from 'fs';
import { resolve } from 'path';

/**
 * Xóa tập tin vật lý khỏi thư mục public.
 * @param filePath Đường dẫn tương đối của file (ví dụ: '/uploads/avatars/abc.jpg' hoặc 'uploads/avatars/abc.jpg')
 */
export function deleteFile(filePath: string): void {
  if (!filePath) {
    return;
  }

  // 1. Xử lý đúng path có leading slash (loại bỏ dấu gạch chéo đầu tiên nếu có để tránh sai lệch đường dẫn)
  const cleanedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;

  // 2. Định nghĩa thư mục root cho static files
  const rootDir = resolve(__dirname, '..', '..', '..', 'public');
  const physicalPath = resolve(rootDir, cleanedPath);

  // 3. Bảo mật: Chống lỗi Path Traversal (chỉ cho phép xóa các file nằm trong thư mục public)
  if (!physicalPath.startsWith(rootDir)) {
    throw new Error('Truy cập đường dẫn không hợp lệ');
  }

  // 4. Thực hiện xóa file vật lý
  if (existsSync(physicalPath)) {
    unlinkSync(physicalPath);
  }
}

/**
 * Đảm bảo thư mục tồn tại. Nếu chưa có thì tạo mới.
 */
export function ensureDirExists(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Chuẩn hóa đường dẫn lưu trữ để tránh double prefix.
 * @param filename Tên file
 * @param subDir Thư mục con dưới uploads (ví dụ: 'avatars')
 */
export function getUploadPath(filename: string, subDir = 'avatars'): string {
  // Tránh double prefix: kết quả trả về luôn có dạng /uploads/subDir/filename
  // và không bị lặp /uploads/uploads/ hay tương tự.
  const prefix = '/uploads';
  return `${prefix}/${subDir}/${filename}`;
}
