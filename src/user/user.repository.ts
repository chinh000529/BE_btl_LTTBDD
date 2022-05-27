import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import { Report } from '../report/report.entity'

@EntityRepository(User) 
export class UserRepository extends Repository<User> {

    async getUserByStatus(params) {
        const queryBuilder = this.createQueryBuilder()
        .select(`
            kq.username,
            kq.name,
            kq.report_id,
            kq.status,
            kq.note
        `)
        .distinct(true)
        .from(
            (subQuery) => {
                return subQuery
                .select(`
                    u.username AS username,
                    u.name AS name,
                    CASE
                        WHEN r.report_id IS NULL THEN 0
                        ELSE r.report_id
                    END as report_id,
                    CASE
                        WHEN r.status IS NULL THEN 1
                        ELSE r.status
                    END as status,
                    CASE
                        WHEN r.note IS NULL THEN 'Chưa khai báo sức khỏe'
                        ELSE r.note
                    END as note
                `)
                .from(User, 'u')
                .leftJoin(
                    (subQuery) => {
                        return subQuery
                        .select(`
                            rp.id AS report_id,
                            rp.status AS status,
                            rp.note AS note,
                            rp.created_by AS username
                        `)
                        .from(Report, 'rp')
                        .where(
                            "rp.created_at BETWEEN :dateReportFrom AND :dateReportTo",
                            { dateReportFrom: params.dateReportFrom, dateReportTo: params.dateReportTo }
                            );
                    },
                    'r',
                    'r.username = u.username',
                )
                .where("u.username <> '999999'")
            }, 'kq'
        )
        if (params.status || params.status === 0) {
            if (params.status != 3) {
                queryBuilder.andWhere("kq.status = :status", { status: params.status })
            }
        }

        if (params.username && params.username !== "null") {
            queryBuilder.andWhere("kq.username like :username", { username: `%${params.username}%` })
        }
        return await queryBuilder.orderBy('kq.status', 'DESC').getRawMany();
    }
}
