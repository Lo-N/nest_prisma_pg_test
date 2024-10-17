import { Module } from '@nestjs/common';
import { MeController } from 'src/controllers/me.controller';
import { MeService } from 'src/services/me.service';
import { PrismaService } from 'src/services/prisma.service';
import { UserService } from 'src/services/user.service';

@Module({
  imports: [],
  controllers: [MeController],
  providers: [MeService, UserService, PrismaService],
})
export class MeModule {}
