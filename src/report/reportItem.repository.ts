import { EntityRepository, Repository } from "typeorm";
import { Answer } from "./dto/report.dto";
import { Report } from "./report.entity";
import { ReportItem } from "./report_item.entity";

@EntityRepository(ReportItem)
export class ReportItemRepository extends Repository<ReportItem> {

    async createReportItem(items: Answer[]) {
         items.forEach(item => {
             this.save(item);
         })
    }

    async detailReport(username: String) {
        return this.createQueryBuilder('ri')
            .select(`
                ri.report_id AS report_id,
                ri.question_id AS question_id,
                ri.answer AS answer,
                rp.note AS note
            `)
            .innerJoin(
                (subQuery) => {
                    return subQuery
                        .select(`*`)
                        .from(Report, 'r')
                        .where("r.created_by = :username", { username: username})
                        .orderBy('r.created_at', 'DESC')
                        .limit(1)
                }, 'rp', 'rp.id = ri.report_id'
            )
            .getRawMany();
   }

   async detailReportById(report_id: number) {
    return this.createQueryBuilder('ri')
        .select(`
            ri.report_id AS report_id,
            ri.question_id AS question_id,
            ri.answer AS answer,
            rp.note AS note
        `)
        .innerJoin(
            (subQuery) => {
                return subQuery
                    .select(`*`)
                    .from(Report, 'r')
                    .where("r.id = :report_id", { report_id: report_id})
            }, 'rp', 'rp.id = ri.report_id'
        )
        .getRawMany();
}
}