import { HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../src/services/prisma.service';
import { UserService } from '../../src/services/user.service';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService

  beforeEach(() => {
    prismaService = new PrismaService()
    userService = new UserService(prismaService);
  });

    describe('getUsers', () => {
      it('should return result of findMany method', async () => {
  
        const result = [] as any;
        jest.spyOn(prismaService.user, 'findMany').mockImplementation(() => result);
  
        expect(await userService.getUsers()).toBe(result);
      });
      
      it('should throw an error on error', async () => {
        const error = new Error('test');
        jest.spyOn(prismaService.user, 'findMany').mockImplementation(() => { throw error });
        expect(async () => { await userService.getUsers() }).rejects.toThrow(error);
      });
    });

    describe('getUser', () => {
      const userID = '123';
      it('should return result of findUnique method', async () => {
  
        const result = {} as any;
        jest.spyOn(prismaService.user, 'findUnique').mockImplementation(() => result);
  
        expect(await userService.getUser(userID)).toBe(result);
      });
      
      it('should throw an error on error during findUnique', async () => {
        const error = new Error('test');
        jest.spyOn(prismaService.user, 'findUnique').mockImplementation(() => { throw error });
        expect(async () => { await userService.getUser(userID) }).rejects.toThrow(error);
      });

      it('should throw HttpException when user is not found', async () => {
        const error = new HttpException(`User with id ${userID} not found`, HttpStatus.NOT_FOUND);
        jest.spyOn(prismaService.user, 'findUnique').mockImplementation(() => null as any);
        expect(async () => { await userService.getUser(userID) }).rejects.toThrow(error);
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
        const error = new HttpException('Unable to create user with provided data', HttpStatus.BAD_REQUEST);
        jest.spyOn(prismaService.user, 'create').mockImplementation(() => { throw new Error() });
        jest.spyOn(console, 'error').mockImplementation();
        expect(async () => { await userService.createUser(userData) }).rejects.toThrow(error);
      });
    });

    describe('updateUser', () => {
      const userID = '123';
      const userData = { password: 'new' };

      it('should return result of update method', async () => {
        const result = {} as any;
        jest.spyOn(prismaService.user, 'update').mockImplementation(() => result);
        expect(await userService.updateUser(userID, userData)).toBe(result);
      });

      it('should throw HttpException on error during update method', async () => {
        const error = new HttpException(`Unable to update user with ID ${userID}`, HttpStatus.BAD_REQUEST);
        jest.spyOn(prismaService.user, 'update').mockImplementation(() => { throw new Error() });
        jest.spyOn(console, 'error').mockImplementation();
        expect(async () => { await userService.updateUser(userID, userData) }).rejects.toThrow(error);
      });
    });

    describe('deleteUser', () => {
      const userID = '123';
      it('should return result of delete method', async () => {
  
        const result = {} as any;
        jest.spyOn(prismaService.user, 'delete').mockImplementation(() => result);
  
        expect(await userService.deleteUser(userID)).toBe(result);
      });
      
      it('should throw HttpException on error during delete method', async () => {
        const error = new HttpException(`Unable to delete user with ID ${userID}`, HttpStatus.BAD_REQUEST);
        jest.spyOn(prismaService.user, 'delete').mockImplementation(() => { throw new Error() });
        jest.spyOn(console, 'error').mockImplementation();
        expect(async () => { await userService.deleteUser(userID) }).rejects.toThrow(error);
      });
    });
});
