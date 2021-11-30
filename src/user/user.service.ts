import { HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
    private usersRepository: Repository<User>,
  ) { }

  async findByUsername(username: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ username: username });
  }

  async getAllUsers(page = 1): Promise<UserResponse[]> {
    const perPage = 4;
    const start = (page - 1) * perPage;
    return await this.usersRepository.createQueryBuilder("user").skip(start).take(perPage).getMany();
  }

  async getUserById(userId: number): Promise<UserResponse> {
    const userFound = await this.usersRepository.findOne({ id: userId });
    if (!userFound) {
      throw new NotFoundException("Not found user");
    }
    return userFound;
  }

  async createUser(payload: CreateUserDto): Promise<UserResponse> {
    const newUser = this.usersRepository.create(payload);
    return await this.usersRepository.save(newUser);
  }

  async updateUser(userId: number, payload: UpdateUserDto, role: string, accountId: number): Promise<UserResponse> {
    if (
      (role.toLocaleLowerCase() !== AuthEnum.ADMIN) &&
      (role.toLocaleLowerCase() !== AuthEnum.EMPLOYEE || userId != accountId)
    ) {
      throw new UnauthorizedException("You do not have this right!!!");
    }
    const userFound = await this.usersRepository.findOne({ id: userId });
    if (!userFound) {
      throw new NotFoundException("Not found user");
    }
    Object.assign(userFound, payload);
    return await this.usersRepository.save(userFound);
  }

  async deleteUser(userId: number, role: string): Promise<UserResponse> {
    if (role.toLocaleLowerCase() !== AuthEnum.ADMIN) {
      throw new UnauthorizedException("You do not have this right!!!");
    }
    const userFound = await this.usersRepository.findOne({ id: userId });
    if (!userFound) {
      throw new NotFoundException("Not found user");
    }
    return await this.usersRepository.remove(userFound);
  }
}