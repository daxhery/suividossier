import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredUserRoles = this.reflector.getAllAndOverride<UserRole[]>('UserRoles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredUserRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredUserRoles.some((role) => user.role === role);
  }
} 