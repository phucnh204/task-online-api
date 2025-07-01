// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { GoogleUser } from './auth.types';
import { UsersService } from 'src/users/users.service';
import { Types } from 'mongoose';

interface SafeUser {
  _id: Types.ObjectId;
  email: string;
  name: string;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async loginWithGoogle(token: string): Promise<{
    accessToken: string;
    user: {
      _id: string;
      email: string;
      name: string;
      avatar?: string;
      createdAt?: Date;
      updatedAt?: Date;
    };
  }> {
    try {
      const googleUserData = await axios
        .get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`)
        .then((res) => {
          return res.data as GoogleUser;
        })
        .catch(() => {
          throw new UnauthorizedException('Token Google không hợp lệ');
        });

      // Find or create user

      const userData = {
        email: googleUserData.email,
        name: googleUserData.name,
        avatar: googleUserData.picture,
      };

      const user = await this.usersService.findOrCreate(userData);
      const userObj = user.toObject ? user.toObject() : user;

      const jwtPayload = {
        _id: userObj._id,
        email: userObj.email,
        name: userObj.name,
        avatar: userObj.avatar,
      };

      const accessToken = jwt.sign(
        jwtPayload,
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' },
      );

      const result = {
        accessToken,
        user: {
          _id: userObj._id?.toString(),
          email: userObj.email,
          name: userObj.name,
          avatar: userObj.avatar,
          createdAt: userObj.createdAt,
          updatedAt: userObj.updatedAt,
        },
      };
      return result;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Đăng nhập thất bại');
    }
  }
}
