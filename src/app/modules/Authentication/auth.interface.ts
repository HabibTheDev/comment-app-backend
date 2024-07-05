import { Model } from 'mongoose';

export interface TLoginUser {
  username: string;
  password: string;
}

/* eslint-disable no-unused-vars */
export interface TUser {
  _id: string;
  email: string;
  username: string;
  password: string;
  photo?: string;
}

export interface UserModel extends Model<TUser> {
  isUserExists(email: string, username: string): Promise<TUser | null>;
  isUserExistsId(id: string): Promise<TUser | null>;
  isUserExistsByEmail(email: string): Promise<TUser | null>;
  isUserExistsByUserName(username: string): Promise<TUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isPasswordCompare(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}
