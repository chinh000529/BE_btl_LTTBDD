import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/user.module';
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from '../user/user.entity';
import { EmployeeModule } from '../employee/employee.module';
import { Employee } from "../employee/employee.entity"

@Module({
  imports: [
    AuthModule, 
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123',
      database: 'bai2',
      entities: [User, Employee],
      synchronize: true,
    }),
    EmployeeModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
