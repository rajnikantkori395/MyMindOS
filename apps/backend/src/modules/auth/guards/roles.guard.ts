import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UserRole, isAdminRole } from '../../user/enums';
import { User } from '../../user/schemas/user.schema';

interface AuthenticatedRequest extends Request {
  user?: User;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Check if user's role is in required roles
    if (requiredRoles.includes(user.role)) {
      return true;
    }

    // Allow SUPERADMIN access to any ADMIN-required endpoint
    if (
      user.role === UserRole.SUPERADMIN &&
      requiredRoles.includes(UserRole.ADMIN)
    ) {
      return true;
    }

    return false;
  }
}
