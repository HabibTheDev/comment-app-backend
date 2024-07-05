import httpStatus from 'http-status';
import { TLoginUser, TUser } from './auth.interface';
import AppError from '../../errors/AppError';
import { User } from './auth.model';
import { createToken } from '../../utils/createToken';
import config from '../../config';

const registerUserIntoDB = async (payload: TUser) => {
  if (await User.isUserExists(payload.email, payload.username)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User Already Exists');
  }

  const newUser = await User.create(payload);
  return newUser;
};

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByUserName(payload.username);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not match');
  }

  const jwtPayload = {
    username: user.username,
    _id: user._id,
    email: user.email,
  };

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const innerData = {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
    token,
  };

  const response = innerData;

  return response;
};

export const AuthService = {
  loginUser,
  registerUserIntoDB,
};
