import { existsSync, unlinkSync, mkdirSync } from 'fs';
import { resolve } from 'path';

import { BadRequestException } from '@nestjs/common';

import { ErrorMessages } from '../constants/error-messages.constant';

export function deleteFile(filePath: string): void {
  if (!filePath) {
    return;
  }

  const cleanedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;

  const rootDir = resolve(__dirname, '..', '..', '..', 'public');
  const physicalPath = resolve(rootDir, cleanedPath);

  if (!physicalPath.startsWith(rootDir)) {
    throw new BadRequestException(ErrorMessages.INVALID_PATH_ACCESS);
  }

  if (existsSync(physicalPath)) {
    unlinkSync(physicalPath);
  }
}


export function ensureDirExists(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}


export function getUploadPath(filename: string, subDir = 'avatars'): string {
  const prefix = '/uploads';
  return `${prefix}/${subDir}/${filename}`;
}
