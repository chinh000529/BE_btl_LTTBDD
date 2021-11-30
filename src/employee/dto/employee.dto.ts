import { IsEmail, IsInt, IsNotEmpty, IsString, MaxLength, IsPhoneNumber } from "class-validator"

export class CreateEmployeeDto {
    @IsString()
    @MaxLength(30)
    name: string;

    @IsString()
    phone: string;

    @IsString()
    @MaxLength(50)
    address: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsInt()
    accountId: number;
}

export class UpdateEmployeeDto {
    name?: string;
    phone?: string;
    address?: string;
    email?: string;
    accountId?: number;
}

export class EmployeeResponse {
    name: string;
    phone: string;
    address: string;
    email: string;
    accountId: number;
}