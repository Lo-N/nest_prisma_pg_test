import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { RegistrationDto } from 'src/dto/registration.dto';
import { UserErrorMessages } from 'src/utils/userErrorMessages.utils';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    incomingLogin: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    try {
      const { id, login, role, password } =
        await this.userService.getUserByLogin(incomingLogin);

      if (!(await compare(pass, password))) {
        throw new Error(UserErrorMessages.INVALID_CREDENTIALS());
      }

      const payload = { id, login, role };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.warn(`An error occur at ${this.signIn.name}`, error);

      throw new UnauthorizedException(UserErrorMessages.INVALID_CREDENTIALS());
    }
  }

  async signUp(userData: RegistrationDto): Promise<{ access_token: string }> {
    try {
      const { id, login, role } = await this.userService.createUser(userData);

      const payload = { id, login, role };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.warn(`An error occur at ${this.signUp.name}`, error);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        UserErrorMessages.SOMETHING_WENT_WRONG(),
      );
    }
  }
}
