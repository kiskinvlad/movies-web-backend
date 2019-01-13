export interface UserModel {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  image?: string;
  isVerified: boolean;
}