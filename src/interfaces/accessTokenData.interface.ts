import { Role } from '@prisma/client';

export interface IAccessTokenData {
  id: string;
  login: string;
  role: Role;
  iat: number;
  exp: number;
}
