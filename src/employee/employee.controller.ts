import { Body, Controller, Get, Post, UseGuards, Request, Param, Put, Delete, UseInterceptors, ClassSerializerInterceptor, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeResponse } from './dto/employee.dto';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
    constructor(
        private employeeService: EmployeeService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAllEmployee(
        @Query('page') page: number,
    ): Promise<EmployeeResponse[]> {
        return await this.employeeService.getAllEmployee(page);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/search')
    async getEmployeeByName(
        @Query('name') name: string,
    ): Promise<EmployeeResponse[]> {
        return await this.employeeService.getEmployeeByName(name);
    }

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    async createEmployee(
        @Body() body: CreateEmployeeDto,
        @Request() req,
    ): Promise<EmployeeResponse> {
        return await this.employeeService.createEmployee(body, req.user.role);
    }

    @Put('/:employeeId')
    @UseGuards(JwtAuthGuard)
    async updateEmployee(
        @Param('employeeId') employeeId: number,
        @Body() body: UpdateEmployeeDto,
        @Request() req,
    ): Promise<EmployeeResponse> {
        return await this.employeeService.updateEmployee(employeeId, body, req.user.role, req.user.id);
    }

    @Delete('/:employeeId')
    @UseGuards(JwtAuthGuard)
    async deleteEmployee(
        @Param('employeeId') employeeId: number,
        @Request() req,
    ): Promise<EmployeeResponse> {
        return await this.employeeService.deleteEmployee(employeeId, req.user.role);
    }
}
