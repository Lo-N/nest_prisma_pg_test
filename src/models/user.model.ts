import { $Enums, User } from "@prisma/client";

export class UserModel implements User {
  id: string;
  login: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  age: number;
  role: $Enums.Role;
}
