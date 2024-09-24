import { $Enums } from '@prisma/client';

export interface IPublicUserData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  login: string;
  name: string;
  age: number;
  role: $Enums.Role;
}
