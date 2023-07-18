import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(name: string, password?: string): Promise<any> {
    const user = await this.userService.getUserByName(name);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
  async findUserByTokenPayload(payload: any): Promise<any> {
    const user = await this.userService.getUserByName(payload.username);
    return user;
  }

  async login(user: any): Promise<{ accessToken: string }> {
    const payload = { username: user.name, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
