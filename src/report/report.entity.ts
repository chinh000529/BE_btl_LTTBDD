import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Report {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: number;

    @Column()
    note: string;

    @Column()
    created_by: string;

    @Column()
    created_at: Date;
}