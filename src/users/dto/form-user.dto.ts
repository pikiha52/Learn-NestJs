import { IsNotEmpty, Min } from "class-validator";

export class FormUserDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}