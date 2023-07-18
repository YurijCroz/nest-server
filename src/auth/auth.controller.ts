import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body('name') name: string, @Body('password') password: string) {
    const user = await this.authService.validateUser(name, password);
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  protectedRoute() {
    return { message: 'Hello' };
  }
}
