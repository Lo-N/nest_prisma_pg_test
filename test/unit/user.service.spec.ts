import {
  ConflictException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { UserService } from 'src/services/user.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/dto/user.dto';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { UserModel } from 'src/models/user.model';
import { Prisma, Role } from '@prisma/client';
import { EPrismaErrorCodes } from 'src/enums/prisma.enum';
import { UserErrorMessages } from 'src/utils/userErrorMessages.utils';
import { Test, TestingModule } from '@nestjs/testing';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  const mockUserId = '123';
  const mockLogin = 'test-user-login';
  const mockPassword = 'test-user-password';
  const mockName = 'test-user-name';
  const mockAge = 25;
  const mockRole = Role.admin;
  const publicUserData = {
    id: mockUserId,
    login: mockLogin,
    name: mockName,
    age: mockAge,
    role: mockRole,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const dbUser: UserModel = {
    password: mockPassword,
    ...publicUserData,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        UserService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'DATABASE_URL') {
                return 'postgresql://postgres:postgres';
              }
              return 'mock';
            }),
          },
        },
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    userService = module.get<UserService>(UserService);
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('removeUserPassword', () => {
    it("should return user's public data", () => {
      expect(
        userService.removeUserPassword({
          ...publicUserData,
          password: mockPassword,
        }),
      ).toEqual(publicUserData);
    });
  });

  describe('getUsers', () => {
    it('should return result of findMany method', async () => {
      const result = [] as any;
      jest
        .spyOn(prismaService.user, 'findMany')
        .mockImplementationOnce(() => result);

      expect(await userService.getAllUsers()).toBe(result);
    });

    it('should throw HttpException on an error', async () => {
      const error = new HttpException(
        UserErrorMessages.UNABLE_TO_GET_LIST_OF_USERS(),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      jest.spyOn(prismaService.user, 'findMany').mockImplementationOnce(() => {
        throw new Error('test');
      });

      await expect(userService.getAllUsers()).rejects.toThrow(error);
    });
  });

  describe('getUserById', () => {
    it('should return result of findUnique method', async () => {
      const result = {} as any;
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockImplementationOnce(() => result);

      await expect(userService.getUserById(mockUserId)).resolves.toBe(result);
    });

    it('should throw NotFoundException when user is not found', async () => {
      const error = new NotFoundException(
        UserErrorMessages.NOT_FOUND_BY_ID(mockUserId),
      );
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockImplementationOnce(() => {
          throw new Error();
        });

      await expect(userService.getUserById(mockUserId)).rejects.toThrow(error);
    });
  });

  describe('getUserByLogin', () => {
    it('should return result of findUniqueOrThrow method', async () => {
      const result = {} as any;
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockImplementationOnce(() => result);

      await expect(userService.getUserByLogin(mockLogin)).resolves.toBe(result);
    });

    it('should throw NotFoundException when user is not found', async () => {
      const error = new NotFoundException(
        `User with login ${mockLogin} not found`,
      );
      jest
        .spyOn(prismaService.user, 'findUniqueOrThrow')
        .mockImplementationOnce(() => {
          throw new Error();
        });

      await expect(userService.getUserByLogin(mockLogin)).rejects.toThrow(
        error,
      );
    });
  });

  describe('createUser', () => {
    const userCreateData: CreateUserDto = {
      login: mockLogin,
      password: mockPassword,
      name: mockName,
      age: mockAge,
      role: mockRole,
    };

    it('should return result of create method', async () => {
      jest
        .spyOn(prismaService.user, 'create')
        .mockImplementationOnce(() => dbUser as any);

      const removeUserPasswordMethod = jest.spyOn(
        userService,
        'removeUserPassword',
      );

      await expect(userService.createUser(userCreateData)).resolves.toEqual(
        publicUserData,
      );
      expect(removeUserPasswordMethod).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException on constraint error during create method', async () => {
      const error = new ConflictException(
        `Login - ${userCreateData.login} already registered`,
      );

      const prismaError = new Prisma.PrismaClientKnownRequestError('', {
        code: EPrismaErrorCodes.UniqueConstraintFailed,
        clientVersion: '',
      });

      jest.spyOn(prismaService.user, 'create').mockImplementationOnce(() => {
        throw prismaError;
      });

      await expect(userService.createUser(userCreateData)).rejects.toThrow(
        error,
      );
    });

    it('should throw HttpException on an error during create method', async () => {
      const error = new HttpException(
        'Unable to create user with provided data',
        HttpStatus.BAD_REQUEST,
      );
      jest.spyOn(prismaService.user, 'create').mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(userService.createUser(userCreateData)).rejects.toThrow(
        error,
      );
    });
  });

  describe('updateUser', () => {
    const userData: UpdateUserDto = { password: 'new' };

    it('should return result of update method', async () => {
      jest
        .spyOn(prismaService.user, 'update')
        .mockImplementationOnce(() => dbUser as any);

      const removeUserPasswordMethod = jest.spyOn(
        userService,
        'removeUserPassword',
      );

      await expect(
        userService.updateUser(mockUserId, userData),
      ).resolves.toEqual(publicUserData);

      expect(removeUserPasswordMethod).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when user not found during update method', async () => {
      const error = new NotFoundException(
        UserErrorMessages.NOT_FOUND_BY_ID(dbUser.id),
      );

      const prismaError = new Prisma.PrismaClientKnownRequestError('', {
        code: EPrismaErrorCodes.UnableToFindDuringAnOperation,
        clientVersion: '',
      });

      jest.spyOn(prismaService.user, 'update').mockImplementationOnce(() => {
        throw prismaError;
      });

      await expect(userService.updateUser(dbUser.id, userData)).rejects.toThrow(
        error,
      );
    });

    it('should throw ConflictException on constraint error during update method', async () => {
      const error = new ConflictException(
        `Login - ${dbUser.login} already registered`,
      );

      const prismaError = new Prisma.PrismaClientKnownRequestError('', {
        code: EPrismaErrorCodes.UniqueConstraintFailed,
        clientVersion: '',
      });

      jest.spyOn(prismaService.user, 'update').mockImplementationOnce(() => {
        throw prismaError;
      });

      await expect(
        userService.updateUser(dbUser.id, { login: dbUser.login }),
      ).rejects.toThrow(error);
    });

    it('should throw HttpException on an error during update method', async () => {
      const error = new HttpException(
        `Unable to update user with ID ${mockUserId}`,
        HttpStatus.BAD_REQUEST,
      );
      jest.spyOn(prismaService.user, 'update').mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(
        userService.updateUser(mockUserId, userData),
      ).rejects.toThrow(error);
    });
  });

  describe('deleteUser', () => {
    it('should return result of delete method', async () => {
      jest
        .spyOn(prismaService.user, 'delete')
        .mockImplementationOnce(() => dbUser as any);

      const removeUserPasswordMethod = jest.spyOn(
        userService,
        'removeUserPassword',
      );

      await expect(userService.deleteUser(dbUser.id)).resolves.toEqual(
        publicUserData,
      );
      expect(removeUserPasswordMethod).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when user not found', async () => {
      const error = new NotFoundException(
        UserErrorMessages.NOT_FOUND_BY_ID(dbUser.id),
      );

      const prismaError = new Prisma.PrismaClientKnownRequestError('', {
        code: EPrismaErrorCodes.UnableToFindDuringAnOperation,
        clientVersion: '',
      });
      jest.spyOn(prismaService.user, 'delete').mockImplementationOnce(() => {
        throw prismaError;
      });

      await expect(userService.deleteUser(dbUser.id)).rejects.toThrow(error);
    });

    it('should throw HttpException on an error during delete method', async () => {
      const error = new HttpException(
        UserErrorMessages.UNABLE_TO_DELETE_USER(dbUser.id),
        HttpStatus.BAD_REQUEST,
      );
      jest.spyOn(prismaService.user, 'delete').mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(userService.deleteUser(dbUser.id)).rejects.toThrow(error);
    });
  });
});
