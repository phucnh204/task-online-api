import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Partial<User>): Promise<User> {
    try {
      const user = await this.userModel.create(data);

      return user;
    } catch (error) {
      console.error('❌ [UsersService] Failed to create user:', error);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userModel.find().exec();

      return users;
    } catch (error) {
      console.error('❌ [UsersService] Failed to find users:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const user = await this.userModel.findById(id).exec();

      return user;
    } catch (error) {
      console.error('❌ [UsersService] Failed to find user by ID:', error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userModel.findOne({ email }).exec();

      return user;
    } catch (error) {
      console.error('❌ [UsersService] Failed to find user by email:', error);
      throw error;
    }
  }

  async findOrCreate(userData: Partial<User>): Promise<UserDocument> {
    try {
      // Find existing user

      let user = await this.userModel.findOne({ email: userData.email }).exec();

      if (!user) {
        user = await this.userModel.create(userData);
      }

      return user;
    } catch (error) {
      console.error('💥 [UsersService] findOrCreate failed:', error);
      throw error;
    }
  }
}
