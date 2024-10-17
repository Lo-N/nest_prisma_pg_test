import { Injectable } from '@nestjs/common';
import { UserModel } from '../models/user.model';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { IPublicUserData } from 'src/interfaces/publicUserData.interface';
import { UserService } from './user.service';

@Injectable()
export class MeService {
  constructor(private userService: UserService) {}

  async getMe(id: string): Promise<UserModel> {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
      console.warn(`An error occur at ${this.getMe.name}`, error);
      throw error;
    }
  }

  async updateMe(
    id: string,
    userData: UpdateUserDto,
  ): Promise<IPublicUserData> {
    try {
      return this.userService.updateUser(id, userData);
    } catch (error) {
      console.warn(`An error occur at ${this.updateMe.name}`, error);
      throw error;
    }
  }

  async deleteMe(id: string): Promise<IPublicUserData> {
    try {
      return this.userService.deleteUser(id);
    } catch (error) {
      console.warn(`An error occur at ${this.deleteMe.name}`, error);
      throw error;
    }
  }
}
