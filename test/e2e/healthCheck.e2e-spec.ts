import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/modules/app.module';
import { PrismaService } from '../../src/services/prisma.service';

describe('Health check (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    jest
      .spyOn(moduleFixture.get<PrismaService>(PrismaService), 'onModuleInit')
      .mockImplementation(jest.fn());
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('/health_check (GET)', () => {
    return request(app.getHttpServer())
      .get('/health_check')
      .expect(200)
      .expect('Hello World!');
  });
});
