import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeController } from './employee.controller';
import { Employee } from './employee.entity';
import { EmployeeService } from './employee.service';
import { ValidEmployeeMiddleware } from "../common/middleware/validEmployee.middleware"

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  controllers: [EmployeeController],
  providers: [EmployeeService]
})
export class EmployeeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidEmployeeMiddleware).forRoutes({
      path: "employees/:employeeId",
      method: RequestMethod.PUT,
    });
    consumer.apply(ValidEmployeeMiddleware).forRoutes({
      path: 'employees/:employeeId',
      method: RequestMethod.DELETE,
    })
  }
}
