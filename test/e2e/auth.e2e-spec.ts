import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { EUserRoles } from '../../src/enums/user.enum';
import { $Enums, Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

describe('Authentication /auth/login (POST) (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    jest.spyOn(prismaService, 'onModuleInit').mockImplementation(jest.fn());

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    jest.spyOn(console, 'warn').mockImplementation()

    await app.init();
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('Should return bad request when request body is empty', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({})
      .expect(400)
      .expect({
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
        message: [
          'login should not be empty',
          'login must be a string',
          'password should not be empty',
          'password must be a string',
        ],
      });
  });

  it('Should return unauthorized when no users found by provided login', () => {
    const unknownCredentials = {
      login: 'unknown_login',
      password: 'unknown_password',
    };

    jest.spyOn(prismaService.user, 'findUnique').mockImplementation(jest.fn());

    return request(app.getHttpServer())
      .post('/auth/login')
      .send(unknownCredentials)
      .expect(401)
      .expect({
        message: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
  });

  it('Should return jwt token', async () => {
    const credentials = {
      login: 'login',
      password: 'password',
    };

    const userMock = {
      id: Date.now().toString(),
      login: credentials.login,
      name: 'user1',
      password: credentials.password,
      createdAt: new Date(),
      updatedAt: new Date(),
      age: 20,
      role: EUserRoles.Guest,
    };

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => true)

    jest.spyOn(prismaService.user, 'findUniqueOrThrow').mockImplementation(
      () =>
        userMock as unknown as Prisma.Prisma__UserClient<{
          id: string;
          createdAt: Date;
          updatedAt: Date;
          login: string;
          password: string;
          name: string;
          age: number;
          role: $Enums.Role;
        }>,
    );

    const mockJwtToken = 'qwerty123456';
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockJwtToken);

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials);

    expect(res.body.access_token).toBe(mockJwtToken);
    expect(res.statusCode).toBe(HttpStatus.OK);
  });
});
