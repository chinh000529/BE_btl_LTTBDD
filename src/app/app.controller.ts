import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller()
export class AppController {
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}