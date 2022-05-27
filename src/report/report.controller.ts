import { Body, Request, ClassSerializerInterceptor, Controller, Post, UseGuards, UseInterceptors, Get, Param, Query } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/report.dto'

@Controller('report')
export class ReportController {
    constructor(
        private reportService: ReportService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Post('/submit')
    async submitReport(
        @Body() body: CreateReportDto,
        @Request() req,
    ) {
        const response = await this.reportService.submitReport(body, req.user);

        return response;
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/detail')
    async detailReport(
        @Request() req,
    ) {
        const response = await this.reportService.detailReport(req.user);

        return response;
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/detail_by_id')
    async detailReportById(
        @Query('report_id') report_id: number,
    ) {
        const response = await this.reportService.detailReportById(report_id);

        return response;
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get('/check')
    async checkReport(
        @Request() req,
    ) {
        const response = await this.reportService.checkReport(req.user);

        return response;
    }

}
