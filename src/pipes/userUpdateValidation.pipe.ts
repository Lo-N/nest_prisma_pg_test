import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/user.dto';

@Injectable()
export class UserUpdateValidationPipe implements PipeTransform {
  transform(value: UpdateUserDto, metadata: ArgumentMetadata) {
    if (
      !value.age &&
      !value.login &&
      !value.name &&
      !value.password &&
      !value.role
    ) {
      throw new BadRequestException('Incorrect data for update user');
    }

    return value;
  }
}
