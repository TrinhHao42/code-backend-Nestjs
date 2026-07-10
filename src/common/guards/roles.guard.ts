import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRole } from '../../modules/users/entities/user.entity';
import { ErrorMessages } from '../constants/error-messages.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<{ user?: { role: UserRole } }>();
    const user = request.user;

    const hasRole = !!user && requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException(ErrorMessages.NO_PERMISSION);
    }
    return true;
  }
}
