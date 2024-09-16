import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateUserDto } from '../dto/user.dto';
import { UserModel } from '../models/user.model';
import { UpdateUserDto } from 'src/dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(): Promise<UserModel[]> {
    return this.prisma.user.findMany();
  }

  async getUser(id: string): Promise<UserModel> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new HttpException(
        `User with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async getUserByLogin(login: string): Promise<UserModel> {
    const user: UserModel | null = await this.prisma.user.findUnique({ where: { login } });
    if (!user) {
      throw new HttpException(
        `User with login ${login} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async createUser(userData: CreateUserDto): Promise<UserModel> {
    try {
      return await this.prisma.user.create({ data: userData });
    } catch (error) {
      console.error(`An error occur at ${this.createUser.name}`, error);
      throw new HttpException(
        'Unable to create user with provided data',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<UserModel> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data: userData,
      });
    } catch (error) {
      console.error(`An error occur at ${this.updateUser.name}`, error);
      throw new HttpException(
        `Unable to update user with ID ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUser(id: string): Promise<UserModel> {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      console.error(`An error occur at ${this.deleteUser.name}`, error);
      throw new HttpException(
        `Unable to delete user with ID ${id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
