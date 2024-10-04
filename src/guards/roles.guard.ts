import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/decorators/role.decorator';
import { UserErrorMessages } from 'src/utils/userErrorMessages.utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const requestUser = request.user;
    if (!requestUser?.role) {
      return false;
    }

    if (roles.includes(requestUser?.role)) {
      return true;
    } else {
      throw new ForbiddenException(UserErrorMessages.ACCESS_DENIED());
    }
  }
}
