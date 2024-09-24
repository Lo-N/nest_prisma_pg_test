import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(login: string, pass: string): Promise<{ access_token: string }> {
    try {
      const user = await this.userService.getUserByLogin(login);

      if (!(await compare(pass, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { sub: user.id, username: user.login };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.error(`An error occur at ${this.signIn.name}`, error);
      throw new UnauthorizedException();
    }
  }
}
