import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'src/user/user.dto';
import { IUser } from 'src/user/user.interface';

@Injectable()
export class DataBaseService {
  users: IUser[] = [];

  async getUserById(id: string): Promise<IUser> {
    const user = this.users.find(user => user.id === id) || null;
    if (!user) {
      throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getAllUsers(): Promise<IUser[]> {
    return this.users;
  }

  async createUser(userData: CreateUserDto): Promise<IUser> {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
    }
    this.users.push(newUser);

    return newUser;
  }

  async updateUser(id: string, userData: UpdateUserDto): Promise<IUser> {
    const user = this.users.find(user => user.id === id) || null;

    if (!user) {
      throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
    }

    user.age = userData.age ? userData.age : user.age;
    user.login = userData.login ? userData.login : user.login;
    user.name = userData.name ? userData.name : user.name;
    user.password = userData.password ? userData.password : user.password;
    user.role = userData.role ? userData.role : user.role;

    return user;
  }

  async deleteUser(id: string): Promise<IUser> {
    const user = this.users.find(user => user.id === id) || null;
    if (!user) {
      throw new HttpException(`User with id ${id} not found`, HttpStatus.NOT_FOUND);
    }

    this.users = this.users.filter(savedUser => savedUser.id === id);

    return user;
  }
}
