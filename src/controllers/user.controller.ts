import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { UserUpdateValidationPipe } from '../pipes/userUpdateValidation.pipe';
import { UserModel } from '../models/user.model';
import { Public } from '../decorators/route.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get()
  async getUsers(): Promise<UserModel[]> {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUser(@Param() params: { id: string }): Promise<UserModel> {
    return this.userService.getUser(params.id);
  }

  @Post()
  async createUser(@Body() userDto: CreateUserDto): Promise<UserModel> {
    return this.userService.createUser(userDto);
  }

  @Put(':id')
  async updateUser(@Param() params: { id: string }, @Body(new UserUpdateValidationPipe()) updateUserDto: UpdateUserDto): Promise<UserModel> {
    return this.userService.updateUser(params.id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param() params: { id: string }): Promise<UserModel> {
    return this.userService.deleteUser(params.id);
  }
}
