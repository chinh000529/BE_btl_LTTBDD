import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReportItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    question_id: number;

    @Column()
    report_id: number;

    @Column()
    answer: number;
}