import { Body, Controller, Delete, Get, Put } from '@nestjs/common';
import { MeService } from '../services/me.service';
import { UserUpdateValidationPipe } from '../pipes/userUpdateValidation.pipe';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { IPublicUserData } from 'src/interfaces/publicUserData.interface';
import { IAccessTokenData } from 'src/interfaces/accessTokenData.interface';
import { User } from 'src/decorators/user.decorator';

@Controller('me')
export class MeController {
  constructor(private readonly meService: MeService) {}

  @Get()
  async getMe(@User() user: IAccessTokenData): Promise<IPublicUserData> {
    return this.meService.getMe(user.id);
  }

  @Put()
  async updateMe(
    @User() user: IAccessTokenData,
    @Body(new UserUpdateValidationPipe()) updateUserDto: UpdateUserDto,
  ): Promise<IPublicUserData> {
    return this.meService.updateMe(user.id, updateUserDto);
  }

  @Delete()
  async deleteMe(@User() user: IAccessTokenData): Promise<IPublicUserData> {
    return this.meService.deleteMe(user.id);
  }
}
