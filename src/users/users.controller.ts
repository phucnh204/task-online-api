import { Controller, Get, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    try {
      console.log('🔍 [UsersController] Getting all users...');
      const users = await this.usersService.findAll();
      console.log('✅ [UsersController] Found users:', users.length);
      return {
        success: true,
        count: users.length,
        users: users,
      };
    } catch (error) {
      console.error('❌ [UsersController] Error getting users:', error);
      return {
        success: false,
        // error: error.message,
      };
    }
  }
}
