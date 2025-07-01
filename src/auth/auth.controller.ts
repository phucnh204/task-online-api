import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async loginWithGoogle(@Body('token') token: string) {
    return this.authService.loginWithGoogle(token);
  }
}
