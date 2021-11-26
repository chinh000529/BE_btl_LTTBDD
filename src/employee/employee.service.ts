import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto } from "./dto/employee.dto"

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
    ) {}

    async getAllEmployee(): Promise<Employee[]> {
        return this.employeeRepository.find();
    }

    async getEmployeeByName(name: string): Promise<Employee[]> {
        const employeeList = await this.employeeRepository.find({name: name});
        if(employeeList.length === 0) {
            throw new HttpException("Not found employee!!!", 400)
        }
        return employeeList;
    }

    async createEmployee(payload: CreateEmployeeDto, role: string) {
        if(role.toLocaleLowerCase() === "admin") {
            const newEmployee = await this.employeeRepository.create(payload);
            return await this.employeeRepository.save(newEmployee);
        }
        throw new UnauthorizedException("You do not have this right!!!");
    }

    async updateEmployee(employeeId: number, payload: UpdateEmployeeDto, role: string, accountId: number): Promise<Employee> {
        if(role.toLocaleLowerCase() === "admin") {
            const employeeFound = await this.employeeRepository.findOne({id: employeeId});
            Object.assign(employeeFound, payload);
            return await this.employeeRepository.save(employeeFound);
        }
        if(role.toLocaleLowerCase() === "employee") {
            const employeeFound = await this.employeeRepository.findOne({id: employeeId});
            if(employeeFound.accountId === accountId) {
                Object.assign(employeeFound, payload);
                return await this.employeeRepository.save(employeeFound);
            }
            throw new UnauthorizedException("You do not have this right!!!");
        }
        throw new UnauthorizedException("You do not have this right!!!");
    }

    async deleteEmployee(employeeId: number, role: string): Promise<Employee> {
        if(role.toLocaleLowerCase() === 'admin') {
            const employeeFound = await this.employeeRepository.findOne({id: employeeId});
            return await this.employeeRepository.remove(employeeFound);
        }
        throw new UnauthorizedException("You do not have this right!!!");
    }
}
