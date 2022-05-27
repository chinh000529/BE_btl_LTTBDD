import { Controller, Get, Request, UseGuards, UseInterceptors, ClassSerializerInterceptor, Post, Body, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserResponse, UpdateUserRequest, UserByStatusResponse, UserByStatusRequest } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UsersController {
    constructor(
        private userService: UserService,
    ) { }

    // @UseGuards(JwtAuthGuard)
    // @UseInterceptors(ClassSerializerInterceptor)
    // @Get()
    // getAllUser(
    //     @Query('page') page: number,
    // ): Promise<UserResponse[]> {
    //     return this.userService.getAllUsers(page);
    // }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/info')
    async getInfoUser(
        @Request() req,
    ): Promise<UserResponse> {
        return new UserResponse(await this.userService.findByUsername(req.user.username));
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('/update')
    async updateUser(
        @Body() body: UpdateUserRequest,
    ) {
        const response = await this.userService.updateUser(body);
        return response;
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    getUserByStatus(
        @Query('status') status: number,
        @Query('username') username: string,
        @Query('date') date: string,
    ) {
        return this.userService.getUserByStatus(status, date, username);
    }
}
