import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto"
import { UserResponse } from "./dto/user.dto"
import { AuthEnum } from "../auth/auth.enum"
@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({username: username});
  }

  async getAllUser(page = 1): Promise<UserResponse[]> {
    const perPage = 4;
    const start = (page - 1) * perPage;
    const end = page * perPage;
    return await (await this.userRepository.find()).slice(start, end);
  }

  async getUserById(userId: number): Promise<UserResponse> {
    const userFound = await this.userRepository.findOne({id: userId});
    if (!userFound) {
      throw new HttpException("Not found user", 400);
    }
    return userFound;
  }

  async createUser(payload: CreateUserDto): Promise<UserResponse> {
    const newUser = await this.userRepository.create(payload);
    return await this.userRepository.save(newUser);
  }

  async updateUser(userId: number, payload: UpdateUserDto, role: string, accountId: number): Promise<UserResponse> {
    if((role.toLocaleLowerCase() === AuthEnum.ADMIN || (role.toLocaleLowerCase() === AuthEnum.EMPLOYEE && userId == accountId))) {
      const userFound = await this.userRepository.findOne({id: userId});
      if (!userFound) {
        throw new HttpException("Not found user", 400);
      }
      Object.assign(userFound, payload);
      return await this.userRepository.save(userFound);
    }
    throw new UnauthorizedException("You do not have this right!!!");
  }

  async deleteUser(userId: number, role: string): Promise<UserResponse> {
    if(role.toLocaleLowerCase() === AuthEnum.ADMIN) {
      const userFound = await this.userRepository.findOne({id: userId});
      if (!userFound) {
        throw new HttpException("Not found user", 400);
      }
      return await this.userRepository.remove(userFound);
    }
    throw new UnauthorizedException("You do not have this right!!!");
  }
}