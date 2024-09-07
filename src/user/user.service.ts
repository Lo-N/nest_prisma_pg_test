import { Injectable } from '@nestjs/common';
import { IUser } from './user.interface';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { DataBaseService } from 'src/db/db.service';

@Injectable()
export class UserService {
  constructor(private db: DataBaseService) {}

  async getUsers(): Promise<IUser[]> {
    return this.db.getAllUsers();
  }

  async getUser(id: string): Promise<IUser> {
    const user = await this.db.getUserById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  async createUser(userData: CreateUserDto): Promise<IUser> {
    return this.db.createUser(userData);
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<IUser> {
    const user = await this.db.updateUser(id, userData);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }

  async deleteUser(id: string): Promise<IUser> {
    const user = await this.db.deleteUser(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    return user;
  }
}
