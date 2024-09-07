export interface IUser {
  id: string;
  login: string;
  password: string;
  name: string;
  age: number;
  role: EUserRoles;
}

export enum EUserRoles {
  Admin = 'admin',
  Guest = 'guest',
}
