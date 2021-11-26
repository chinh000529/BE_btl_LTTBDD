import { HttpException, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm";
import { Employee } from "../../employee/employee.entity"
import { Request, Response, NextFunction } from "express"

@Injectable()
export class ValidEmployeeMiddleware implements NestMiddleware {
    constructor(
        @InjectRepository(Employee)
        private employeeRepository: Repository<Employee>,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const employeeId = parseInt(req.params.employeeId);
        const employeeExists = this.employeeRepository.findOne({id: employeeId});
        if(!employeeExists) {
            throw new HttpException("Not found employee",400);
        }
        next();
    }
}