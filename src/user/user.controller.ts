import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request, Query, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto, UpdateUserDto, UserResponse } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UserService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    getAllUser(
        @Query('page') page: number,
    ): Promise<UserResponse[]> {
        return this.userService.getAllUsers(page);
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/:userId')
    async getUserById(
        @Param('userId') userId: number,
    ): Promise<UserResponse> {
        return new UserResponse(await this.userService.getUserById(userId));
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    async createUser(
        @Body() body: CreateUserDto,
    ): Promise<UserResponse> {
        return new UserResponse(await this.userService.createUser(body));
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Put('/:userId')
    async updateUser(
        @Param('userId') userId: number,
        @Body() body: UpdateUserDto,
        @Request() req,
    ): Promise<UserResponse> {
        return new UserResponse(await this.userService.updateUser(userId, body, req.user.role, req.user.id));
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Delete('/:userId')
    async deleteUser(
        @Param('userId') userId: number,
        @Request() req,
    ): Promise<UserResponse> {
        return new UserResponse(await this.userService.deleteUser(userId, req.user.role));
    }
}
