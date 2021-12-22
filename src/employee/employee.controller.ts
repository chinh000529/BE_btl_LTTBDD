import { Body, Controller, Get, Post, UseGuards, Request, Param, Put, Delete, UseInterceptors, ClassSerializerInterceptor, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeResponse } from './dto/employee.dto';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
    constructor(
        private employeeService: EmployeeService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAllEmployees(
        @Query('page') page: number,
    ): Promise<EmployeeResponse[]> {
        return this.employeeService.getAllEmployees(page);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/search')
    getEmployeesByName(
        @Query('name') name: string,
    ): Promise<EmployeeResponse[]> {
        return this.employeeService.getEmployeesByName(name);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    createEmployee(
        @Body() body: CreateEmployeeDto,
        @Request() req,
    ): Promise<EmployeeResponse> {
        return this.employeeService.createEmployee(body, req.user.role);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/:employeeId')
    updateEmployee(
        @Param('employeeId') employeeId: number,
        @Body() body: UpdateEmployeeDto,
        @Request() req,
    ): Promise<EmployeeResponse> {
        return this.employeeService.updateEmployee(employeeId, body, req.user.role, req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:employeeId')
    deleteEmployee(
        @Param('employeeId') employeeId: number,
        @Request() req,
    ): Promise<EmployeeResponse> {
        return this.employeeService.deleteEmployee(employeeId, req.user.role);
    }
}
