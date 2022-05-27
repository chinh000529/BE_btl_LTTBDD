import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportController } from './report.controller';
import { ReportRepository } from './report.repository';
import { ReportService } from './report.service';
import { ReportItemRepository } from './reportItem.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ReportRepository, ReportItemRepository]),],
    providers: [ReportService],
    controllers: [ReportController],
    exports: [ReportService],
})
export class ReportModule {}
