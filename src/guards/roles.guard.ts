import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { EUserRoles } from '../enums/user.enum';
import { UserService } from 'src/services/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private role: EUserRoles,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requestUser = request.user;
    if (!requestUser?.username) {
      return false;
    }

    const user = await this.userService.getUserByLogin(requestUser?.username);

    return user.role === this.role;
  }
}
