import { Body, Controller, Get, Post, UseGuards, Request, Param, Put, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import { EmployeeService } from './employee.service';

@Controller('employees')
export class EmployeeController {
    constructor(
        private employeeService: EmployeeService,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    getAllEmployee() {
        return this.employeeService.getAllEmployee();
    }
    
    @Get('/:name')
    @UseGuards(JwtAuthGuard)
    getEmployeeByName(
        @Param('name') name: string,
    ) {
        return this.employeeService.getEmployeeByName(name);
    }

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    createEmployee(
        @Body() body: CreateEmployeeDto,
        @Request() req,
    ) {
        return this.employeeService.createEmployee(body, req.user.role);
    }

    @Put('/:employeeId')
    @UseGuards(JwtAuthGuard)
    updateEmployee(
        @Param('employeeId') employeeId: number,
        @Body() body: UpdateEmployeeDto,
        @Request() req,
    ) {
        return this.employeeService.updateEmployee(employeeId, body, req.user.role, req.user.id);
    }

    @Delete('/:employeeId')
    @UseGuards(JwtAuthGuard)
    deleteEmployee(
        @Param('employeeId') employeeId: number,
        @Request() req,
    ) {
        return this.employeeService.deleteEmployee(employeeId, req.user.role);
    }
}
