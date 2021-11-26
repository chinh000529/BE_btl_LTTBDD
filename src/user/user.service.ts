import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto"
import passport from 'passport';


@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return await this.userRepository.findOne({username: username});
  }

  async getAllUser(): Promise<any[]> {
    const usersFound = await this.userRepository.find();
    const userList = usersFound.map(user => {
      const {password, ...result} = user;
      return result;
    })
    return userList;
  }

  async getUserById(userId: number): Promise<any> {
    const {password, ...result} = await this.userRepository.findOne({id: userId});
    return result;
    throw new UnauthorizedException("You do not have this right!!!");
  }

  async createUser(payload: CreateUserDto): Promise<any> {
    const newUser = await this.userRepository.create(payload);
    const {password, ...result} = await this.userRepository.save(newUser);
    return result;
  }

  async updateUser(userId: number, payload: UpdateUserDto, role: string, accountId: number): Promise<any> {
    if(role.toLocaleLowerCase() === "admin") {
      const userFound = await this.userRepository.findOne({id: userId});
      Object.assign(userFound, payload);
      const {password, ...result} = await this.userRepository.save(userFound);
      return result;
    }
    if(role.toLocaleLowerCase() === "employee") {
      const userFound = await this.userRepository.findOne({id: userId});
      if(userFound.id === accountId) {
        Object.assign(userFound, payload);
        const {password, ...result} = await this.userRepository.save(userFound);
        return result;
      }
      throw new UnauthorizedException("You do not have this right!!!");
    }
    throw new UnauthorizedException("You do not have this right!!!");
  }

  async deleteUser(userId: number, role: string): Promise<User> {
    if(role.toLocaleLowerCase() === "admin") {
      const userFound = await this.userRepository.findOne({id: userId});
      return await this.userRepository.remove(userFound);
    }
    throw new UnauthorizedException("You do not have this right!!!");
  }
}