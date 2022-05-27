import { Injectable } from '@nestjs/common';
import { CreateReportDto, CreateResponse, CreateResponse1 } from './dto/report.dto'
import { ReportRepository } from './report.repository';
import { UserResponse } from 'src/user/dto/user.dto';
import { ReportItemRepository } from './reportItem.repository';

@Injectable()
export class ReportService {
    constructor(
        private reportRepository: ReportRepository,
        private reportItemRepository: ReportItemRepository,
    ) {}

    async submitReport(payload: CreateReportDto, user: UserResponse) {
        payload.status = 0;
        payload.answers.forEach(item => {
            payload.status = item.answer === 1 ? 2 : payload.status;
        })
        payload.created_by = user.username;
        payload.created_at = new Date();
        const reportCreated = await this.reportRepository.create(payload);
        const newReport = await this.reportRepository.save(reportCreated)
        if (newReport) {
            //create report answer items
            payload.answers.forEach(item => {
                item.report_id = newReport.id;
                item.answer = item.answer === 1 ? item.answer : 0;
            });
            await this.reportItemRepository.createReportItem(payload.answers);
        }

        return CreateResponse(200, "Succesful");
    }

    async detailReport(user: UserResponse) {
        const detailReport = this.reportItemRepository.detailReport(user.username);
        return detailReport;
    }

    async detailReportById(report_id: number) {
        const detailReport = this.reportItemRepository.detailReportById(report_id);
        return detailReport;
    }

    async checkReport(user: UserResponse) {
        const dateReportFrom = new Date(new Date().setHours(0, 0, 0, 0));
        const dateReportTo = new Date(new Date().setHours(23, 59, 59, 99));

        const result = await this.reportRepository.checkReport({
            username: user.username,
            dateReportFrom: dateReportFrom,
            dateReportTo: dateReportTo
        });
        
        if(result) {
            return CreateResponse1(200, true)
        } else {
            return CreateResponse1(200, false)
        } 
    }
}
