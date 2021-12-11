import { NotFoundException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeResponse } from "./dto/employee.dto"
import { AuthEnum } from "../auth/auth.enum"

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(Employee)
        private employeesRepository: Repository<Employee>,
    ) { }

    async getAllEmployees(page = 1): Promise<EmployeeResponse[]> {
        const perPage = 4;
        const start = (page - 1) * perPage;
        return await this.employeesRepository.createQueryBuilder("employee").skip(start).take(perPage).getMany();
    }

    async getEmployeesByName(name: string): Promise<EmployeeResponse[]> {
        const employees = await this.employeesRepository.find({
            where: {
                name: Like('%' + name + '%')
            }
        });
        return employees;
    }

    async createEmployee(payload: CreateEmployeeDto, role: string): Promise<EmployeeResponse> {
        if (role.toLocaleLowerCase() !== AuthEnum.ADMIN) {
            throw new UnauthorizedException("You do not have this right!!!");
        }
        const newEmployee = this.employeesRepository.create(payload);
        return await this.employeesRepository.save(newEmployee);
    }

    async updateEmployee(employeeId: number, payload: UpdateEmployeeDto, role: string, accountId: number): Promise<EmployeeResponse> {
        if (role.toLocaleLowerCase() === AuthEnum.ADMIN) {
            const employeeFound = await this.employeesRepository.findOne({ id: employeeId });
            if (!employeeFound) {
                throw new NotFoundException("Not found Employee!!");
            }
            Object.assign(employeeFound, payload);
            return await this.employeesRepository.save(employeeFound);
        }
        if (role.toLocaleLowerCase() === AuthEnum.EMPLOYEE) {
            const employeeFound = await this.employeesRepository.findOne({ id: employeeId });
            if (!employeeFound) {
                throw new NotFoundException("Not found Employee!!");
            }
            if (employeeFound.accountId === accountId) {
                Object.assign(employeeFound, payload);
                return await this.employeesRepository.save(employeeFound);
            }
            throw new UnauthorizedException("You do not have this right!!!");
        }
        throw new UnauthorizedException("You do not have this right!!!");
    }

    async deleteEmployee(employeeId: number, role: string): Promise<EmployeeResponse> {
        if (role.toLocaleLowerCase() !== AuthEnum.ADMIN) {
            throw new UnauthorizedException("You do not have this right!!!");
        }
        const employeeFound = await this.employeesRepository.findOne({ id: employeeId });
        if (!employeeFound) {
            throw new NotFoundException("Not found Employee!!");
        }
        return await this.employeesRepository.remove(employeeFound);
    }
}
