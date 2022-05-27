import { Exclude } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
export class UserResponse {
    username: string;

    @Exclude()
    password: string;

    role: string;

    name: string;

    phone: string;

    address: string;

    email: string;

    constructor(partial: Partial<UserResponse>) {
        Object.assign(this, partial);
    }
}

export class UpdateUserRequest {
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    role: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    email: string;
}

export function UpdateRespone(status: number, message: string) {
    return {
        status,
        message
    }
}

export class UserByStatusResponse {
    username: string;

    name: string;

    status: number;

    note: string;

    report_id: number;

    constructor(partial: Partial<UserByStatusResponse>) {
        Object.assign(this, partial);
    }
}

export class UserByStatusRequest {
    @IsOptional()
    status: number;

    @IsOptional()
    date: string;

    @IsOptional()
    username: string;
}