import { EntityRepository, getConnection, Repository } from "typeorm";
import { CreateReportDto } from "./dto/report.dto";
import { Report } from "./report.entity";

@EntityRepository(Report)
export class ReportRepository extends Repository<Report> {
    
    async createReport(params: CreateReportDto) {
        const newReport = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Report)
            .values([
                {status: params.status, note: params.note, created_by: params.created_by}
            ])
            .execute()
        
        return newReport;
    } 
    
    async checkReport(params) {
        return await this.createQueryBuilder().select(
            `
            id,
            status,
            note,
            created_by,
            created_at
        `)
        .where("created_by = :username", { username: params.username })
        .andWhere("created_at BETWEEN :dateReportFrom AND :dateReportTo", { dateReportFrom: params.dateReportFrom, dateReportTo: params.dateReportTo })
        .getRawOne();
    }
}