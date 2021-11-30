import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  async login(payload: LoginDto) {
    const userFound = await this.userService.findByUsername(payload.username);
    if (userFound && userFound.password === payload.password) {
      const result = { username: userFound.username, sub: userFound.id, role: userFound.role };
      return {
        access_token: this.jwtService.sign(result),
      };
    }
    throw new UnauthorizedException();
  }
}