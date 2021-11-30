import { Exclude } from "class-transformer";
import { IsNotEmpty, IsString, Length, MaxLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(20)
    username: string;

    @IsNotEmpty()
    @Length(5, 20)
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    role: string;
}
export class UpdateUserDto {
    username?: string;

    password?: string;

    role?: string;
}
export class UserResponse {
    id: number;
    username: string;

    @Exclude()
    password: string;

    role: string;

    constructor(partial: Partial<UserResponse>) {
        Object.assign(this, partial);
    }
}
