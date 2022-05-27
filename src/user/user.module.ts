import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersController } from './user.controller';
import { UserRepository } from './user.repository';
@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]),],
  providers: [UserService,],
  controllers: [UsersController],
  exports: [UserService],
})
export class UsersModule { }