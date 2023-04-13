import { IsNotEmpty, IsOptional, Min } from "class-validator";

export class FormUpdateUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    username: string;

    @IsOptional()
    password: string;
}