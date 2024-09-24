import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/user.dto';
import { UserUpdateValidationPipe } from '../pipes/userUpdateValidation.pipe';
import { UserModel } from '../models/user.model';
import { Public } from '../decorators/route.decorator';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { IPublicUserData } from 'src/interfaces/publicUserData.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get()
  async getAllUsers(): Promise<UserModel[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param() params: { id: string }): Promise<IPublicUserData> {
    return this.userService.getUserById(params.id);
  }

  @Post()
  async createUser(@Body() userDto: CreateUserDto): Promise<IPublicUserData> {
    return this.userService.createUser(userDto);
  }

  @Put(':id')
  async updateUser(
    @Param() params: { id: string },
    @Body(new UserUpdateValidationPipe()) updateUserDto: UpdateUserDto,
  ): Promise<IPublicUserData> {
    return this.userService.updateUser(params.id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param() params: { id: string }): Promise<IPublicUserData> {
    return this.userService.deleteUser(params.id);
  }
}
