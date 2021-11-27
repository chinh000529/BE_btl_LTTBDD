import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeResponse } from "./dto/employee.dto"
import { AuthEnum } from "../auth/auth.enum"

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
    ) {}

    async getAllEmployee(page = 1): Promise<EmployeeResponse[]> {
        const perPage = 4;
        const start = (page -1) * perPage;
        const end = page * perPage;
        return await (await this.employeeRepository.find()).slice(start, end);
    }

    async getEmployeeByName(name: string): Promise<EmployeeResponse[]> {
        const employeeList = await this.employeeRepository.find();
        const employeeFoundByName = employeeList.filter(employee => {
            if(employee.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())) {
                return employee;
            }
        })
        if(employeeFoundByName.length === 0) {
            throw new HttpException("Not found employee!!!", 400)
        }
        return employeeFoundByName;
    }

    async createEmployee(payload: CreateEmployeeDto, role: string): Promise<EmployeeResponse> {
        if(role.toLocaleLowerCase() === AuthEnum.ADMIN) {
            const newEmployee = await this.employeeRepository.create(payload);
            return await this.employeeRepository.save(newEmployee);
        }
        throw new UnauthorizedException("You do not have this right!!!");
    }

    async updateEmployee(employeeId: number, payload: UpdateEmployeeDto, role: string, accountId: number): Promise<EmployeeResponse> {
        if(role.toLocaleLowerCase() === AuthEnum.ADMIN) {
            const employeeFound = await this.employeeRepository.findOne({id: employeeId});
            if(!employeeFound) {
                throw new HttpException("Not found Employee!!", 400);
            }
            Object.assign(employeeFound, payload);
            return await this.employeeRepository.save(employeeFound);
        }
        if(role.toLocaleLowerCase() === AuthEnum.EMPLOYEE) {
            const employeeFound = await this.employeeRepository.findOne({id: employeeId});
            if(!employeeFound) {
                throw new HttpException("Not found Employee!!", 400);
            }
            if(employeeFound.accountId === accountId) {
                Object.assign(employeeFound, payload);
                return await this.employeeRepository.save(employeeFound);
            }
            throw new UnauthorizedException("You do not have this right!!!");
        }
        throw new UnauthorizedException("You do not have this right!!!");
    }

    async deleteEmployee(employeeId: number, role: string): Promise<EmployeeResponse> {
        if(role.toLocaleLowerCase() === AuthEnum.ADMIN) {
            const employeeFound = await this.employeeRepository.findOne({id: employeeId});
            if(!employeeFound) {
                throw new HttpException("Not found Employee!!", 400);
            }
            return await this.employeeRepository.remove(employeeFound);
        }
        throw new UnauthorizedException("You do not have this right!!!");
    }
}
