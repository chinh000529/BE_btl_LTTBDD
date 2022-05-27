import { IsNotEmpty, IsOptional, IsString, Length, MaxLength } from "class-validator";

export class CreateReportDto {
    @IsNotEmpty()
    answers: Answer[];

    @IsOptional()
    status: number;

    @IsOptional()
    @IsString()
    note: string;

    @IsOptional()
    created_by: string;

    @IsOptional()
    created_at: Date;
}

export class Answer {
    @IsOptional()
    report_id: number;

    @IsNotEmpty()
    question_id: number;

    @IsNotEmpty()
    answer: number;
}

export class ReportResponse {
    status: number;

    note: string;

    created_by: string;

    created_at: Date;

    constructor(partial: Partial<ReportResponse>) {
        Object.assign(this, partial);
    }
}

export function CreateResponse(status: number, message: string) {
    return {
        status,
        message
    }
}

export function CreateResponse1(status: number, message: boolean) {
    return {
        status,
        message
    }
}