import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { UserService } from '../../services/user.service';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;
  const userId = '123';

  beforeEach(() => {
    prismaService = new PrismaService();
    userService = new UserService(prismaService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return result of findMany method', async () => {
      const result = [] as any;
      jest
        .spyOn(prismaService.user, 'findMany')
        .mockImplementation(() => result);

      expect(await userService.getUsers()).toBe(result);
    });

    it('should throw an error on error', async () => {
      const error = new Error('test');
      jest.spyOn(prismaService.user, 'findMany').mockImplementation(() => {
        throw error;
      });

      expect(async () => {
        await userService.getUsers();
      }).rejects.toThrow(error);
    });
  });

  describe('getUser', () => {
    it('should return result of findUnique method', async () => {
      const result = {} as any;
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockImplementation(() => result);

      expect(await userService.getUser(userId)).toBe(result);
    });

    it('should throw an error on error during findUnique', async () => {
      const error = new Error('test');
      jest.spyOn(prismaService.user, 'findUnique').mockImplementation(() => {
        throw error;
      });

      expect(async () => {
        await userService.getUser(userId);
      }).rejects.toThrow(error);
    });

    it('should throw HttpException when user is not found', async () => {
      const error = new HttpException(
        `User with id ${userId} not found`,
        HttpStatus.NOT_FOUND,
      );
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockImplementation(() => null as any);

      expect(async () => {
        await userService.getUser(userId);
      }).rejects.toThrow(error);
    });
  });

  describe('createUser', () => {
    const userData = {} as any;
    it('should return result of create method', async () => {
      const result = {} as any;
      jest.spyOn(prismaService.user, 'create').mockImplementation(() => result);

      expect(await userService.createUser(userData)).toBe(result);
    });

    it('should throw HttpException on error during create method', async () => {
      const error = new HttpException(
        'Unable to create user with provided data',
        HttpStatus.BAD_REQUEST,
      );
      jest.spyOn(prismaService.user, 'create').mockImplementation(() => {
        throw new Error();
      });
      jest.spyOn(console, 'error').mockImplementation();

      expect(async () => {
        await userService.createUser(userData);
      }).rejects.toThrow(error);
    });
  });

  describe('updateUser', () => {
    const userData = { password: 'new' };

    it('should return result of update method', async () => {
      const result = {} as any;
      jest.spyOn(prismaService.user, 'update').mockImplementation(() => result);

      expect(await userService.updateUser(userId, userData)).toBe(result);
    });

    it('should throw HttpException on error during update method', async () => {
      const error = new HttpException(
        `Unable to update user with ID ${userId}`,
        HttpStatus.BAD_REQUEST,
      );
      jest.spyOn(prismaService.user, 'update').mockImplementation(() => {
        throw new Error();
      });
      jest.spyOn(console, 'error').mockImplementation();

      expect(async () => {
        await userService.updateUser(userId, userData);
      }).rejects.toThrow(error);
    });
  });

  describe('deleteUser', () => {
    it('should return result of delete method', async () => {
      const result = {} as any;
      jest.spyOn(prismaService.user, 'delete').mockImplementation(() => result);

      expect(await userService.deleteUser(userId)).toBe(result);
    });

    it('should throw HttpException on error during delete method', async () => {
      const error = new HttpException(
        `Unable to delete user with ID ${userId}`,
        HttpStatus.BAD_REQUEST,
      );
      jest.spyOn(prismaService.user, 'delete').mockImplementation(() => {
        throw new Error();
      });
      jest.spyOn(console, 'error').mockImplementation();

      expect(async () => {
        await userService.deleteUser(userId);
      }).rejects.toThrow(error);
    });
  });
});
