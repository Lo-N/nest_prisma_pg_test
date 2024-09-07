import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DataBaseService } from 'src/db/db.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, DataBaseService],
})
export class UserModule {}
