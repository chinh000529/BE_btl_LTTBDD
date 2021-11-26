export class CreateUserDto {
    username: string;
    password: string;
    role: string;
}
export class UpdateUserDto {
    username?: string;
    password?: string;
    role?: string;
}