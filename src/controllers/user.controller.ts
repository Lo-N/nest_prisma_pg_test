import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/user.dto';
import { UserUpdateValidationPipe } from '../pipes/userUpdateValidation.pipe';
import { UserModel } from '../models/user.model';
import { Public } from '../decorators/route.decorator';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { IPublicUserData } from 'src/interfaces/publicUserData.interface';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from '@prisma/client';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Endpoint for testing
  @Public()
  @Get()
  async getAllUsers(): Promise<UserModel[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', type: 'string', description: 'User UUID' })
  async getUserById(@Param() params: { id: string }): Promise<IPublicUserData> {
    return this.userService.getUserById(params.id);
  }

  @Roles([Role.admin])
  @UseGuards(RolesGuard)
  @Post()
  async createUser(@Body() userDto: CreateUserDto): Promise<IPublicUserData> {
    return this.userService.createUser(userDto);
  }

  @Roles([Role.admin])
  @UseGuards(RolesGuard)
  @Put(':id')
  async updateUser(
    @Param() params: { id: string },
    @Body(new UserUpdateValidationPipe()) updateUserDto: UpdateUserDto,
  ): Promise<IPublicUserData> {
    return this.userService.updateUser(params.id, updateUserDto);
  }

  @Roles([Role.admin])
  @UseGuards(RolesGuard)
  @Delete(':id')
  async deleteUser(@Param() params: { id: string }): Promise<IPublicUserData> {
    return this.userService.deleteUser(params.id);
  }
}
