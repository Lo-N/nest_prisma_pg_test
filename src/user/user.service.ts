import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { PrismaService } from 'src/db/prisma.service';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(): Promise<UserModel[]> {
    return this.prisma.user.findMany();
  }

  async getUser(id: string): Promise<UserModel> {
    const user = await this.prisma.user.findUnique({where: { id }});
    if (!user) {
      throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
    }

    return user
  }

  async createUser(userData: CreateUserDto): Promise<UserModel> {
    return this.prisma.user.create({data: userData});
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<UserModel> {
    return this.prisma.user.update({
      where: { id },
      data: userData,
    })
  }

  async deleteUser(id: string): Promise<UserModel> {
    return await this.prisma.user.delete({
      where: { id },
    });
  }
}
