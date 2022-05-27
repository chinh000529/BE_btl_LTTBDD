import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../user/user.module';
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from '../user/user.entity';
import { Report } from '../report/report.entity';
import { ReportItem } from '../report/report_item.entity';
import { ReportModule } from 'src/report/report.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'bai2',
      entities: [User, Report, ReportItem],
      synchronize: false,
    }),
    AuthModule,
    UsersModule,
    ReportModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
