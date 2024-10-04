import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from './prisma.service';
import { CreateUserDto } from '../dto/user.dto';
import { UserModel } from '../models/user.model';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { IPublicUserData } from 'src/interfaces/publicUserData.interface';
import { Prisma } from '@prisma/client';
import { EPrismaErrorCodes } from 'src/enums/prisma.enum';
import { UserErrorMessages } from 'src/utils/userErrorMessages.utils';
import { RegistrationDto } from 'src/dto/registration.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  removeUserPassword(user: UserModel): IPublicUserData {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...publicUsersData } = user;

    return publicUsersData;
  }

  async getAllUsers(): Promise<UserModel[]> {
    try {
      return this.prisma.user.findMany();
    } catch (error) {
      console.warn(`An error occur at ${this.getAllUsers.name}`, error);
      throw new HttpException(
        UserErrorMessages.UNABLE_TO_GET_LIST_OF_USERS(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUserById(id: string): Promise<UserModel> {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      console.warn(`An error occur at ${this.getUserById.name}`, error);
      throw new NotFoundException(UserErrorMessages.NOT_FOUND_BY_ID(id));
    }
  }

  async getUserByLogin(login: string): Promise<UserModel> {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: { login },
      });
    } catch (error) {
      console.warn(`An error occur at ${this.getUserByLogin.name}`, error);
      throw new NotFoundException(UserErrorMessages.NOT_FOUND_BY_LOGIN(login));
    }
  }

  async createUser(
    userData: CreateUserDto | RegistrationDto,
  ): Promise<IPublicUserData> {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...userData,
          password: await hash(userData.password, 10),
        },
      });

      return this.removeUserPassword(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === EPrismaErrorCodes.UniqueConstraintFailed
      ) {
        throw new ConflictException(
          UserErrorMessages.LOGIN_ALREADY_REGISTERED(userData.login),
        );
      }

      console.warn(`An error occur at ${this.createUser.name}`, error);
      throw new BadRequestException(UserErrorMessages.UNABLE_TO_CREATE_USER());
    }
  }

  async updateUser(
    id: string,
    userData: UpdateUserDto,
  ): Promise<IPublicUserData> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: userData.password
          ? { ...userData, password: await hash(userData.password, 10) }
          : userData,
      });

      return this.removeUserPassword(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === EPrismaErrorCodes.UnableToFindDuringAnOperation) {
          throw new NotFoundException(UserErrorMessages.NOT_FOUND_BY_ID(id));
        }
        if (
          error.code === EPrismaErrorCodes.UniqueConstraintFailed &&
          userData.login
        ) {
          throw new ConflictException(
            UserErrorMessages.LOGIN_ALREADY_REGISTERED(userData.login),
          );
        }
      }

      console.warn(`An error occur at ${this.updateUser.name}`, error);
      throw new HttpException(
        UserErrorMessages.UNABLE_TO_UPDATE_USER(id),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUser(id: string): Promise<IPublicUserData> {
    try {
      const user = await this.prisma.user.delete({ where: { id } });

      return this.removeUserPassword(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === EPrismaErrorCodes.UnableToFindDuringAnOperation
      ) {
        throw new NotFoundException(UserErrorMessages.NOT_FOUND_BY_ID(id));
      }

      console.warn(`An error occur at ${this.deleteUser.name}`, error);
      throw new HttpException(
        UserErrorMessages.UNABLE_TO_DELETE_USER(id),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
