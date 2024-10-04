import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class RegistrationDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  age: number;
}
