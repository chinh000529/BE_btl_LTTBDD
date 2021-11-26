import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UsersController {
    constructor(
        private userService: UserService,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    getAllUser() {
        return this.userService.getAllUser();
    }

    @Get('/:userId')
    @UseGuards(JwtAuthGuard)
    getUserById(
        @Param('userId') userId: number,
    ) {
        return this.userService.getUserById(userId);
    }

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    createUser(
        @Body() body: CreateUserDto,
    ) {
        return this.userService.createUser(body);
    }

    @Put('/:userId')
    @UseGuards(JwtAuthGuard)
    updateUser(
        @Param('userId') userId: number,
        @Body() body: UpdateUserDto,
        @Request() req,
    ) {
        return this.userService.updateUser(userId, body, req.user.role, req.user.id);
    }

    @Delete('/:userId')
    @UseGuards(JwtAuthGuard)
    deleteUser(
        @Param('userId') userId: number,
        @Request() req,
    ) {
        return this.userService.deleteUser(userId, req.user.role);
    }
}
