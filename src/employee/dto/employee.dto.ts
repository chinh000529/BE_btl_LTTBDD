export class CreateEmployeeDto {
    name: string;
    phone: string; 
    address: string;
    email: string;
    accountId: number;
}

export class UpdateEmployeeDto {
    name?: string;
    phone?: string; 
    address?: string;
    email?: string;
    accountId?: number;
}