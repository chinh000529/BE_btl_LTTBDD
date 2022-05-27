import { Injectable } from '@nestjs/common';
import { UpdateRespone, UpdateUserRequest, UserByStatusRequest, UserResponse } from "./dto/user.dto"
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {

  constructor(
    private usersRepository: UserRepository,
  ) { }

  async findByUsername(username: string): Promise<UserResponse | undefined> {
    return await this.usersRepository.findOne({ username: username });
  }

  async getAllUsers(page = 1): Promise<UserResponse[]> {
    const perPage = 4;
    const start = (page - 1) * perPage;
    return await this.usersRepository.createQueryBuilder("user").skip(start).take(perPage).getMany();
  }

  async updateUser(body: UpdateUserRequest) {
    const userCurr = this.usersRepository.findOne({ username: body.username});
    if(!userCurr) {
      return UpdateRespone(404, "User not found!!!");
    }
    const userUpdate = {
      ...userCurr,
      ...body
    }
    await this.usersRepository.save(userUpdate);
    return UpdateRespone(200, "Update succesful!!!")
  }

  async getUserByStatus(status: number, date: string, username: string) {
    let dateReportFrom = new Date(new Date().setHours(0, 0, 0, 0))
    let dateReportTo = new Date(new Date().setHours(23, 59, 59, 99))
    if(date && date !== "null") {
      dateReportFrom = new Date(new Date(date).setHours(0, 0, 0, 0))
      dateReportTo = new Date(new Date(date).setHours(23, 59, 59, 99))
    }

    return await this.usersRepository.getUserByStatus({
        username: username,
        status: status,
        dateReportFrom: dateReportFrom,
        dateReportTo: dateReportTo
    });
  }
}