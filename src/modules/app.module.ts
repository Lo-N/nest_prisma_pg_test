import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../controllers/healthCheck.controller';
import { AppService } from '../services/app.service';
import { UserModule } from './user.module';
import { LoggerMiddleware } from '../middlewares/logger.middleware';
import { AuthModule } from './auth.module';
import { MeModule } from './me.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    MeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
