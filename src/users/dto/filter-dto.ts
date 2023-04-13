import { IsNotEmpty, IsOptional } from "class-validator";

export class FilterDto {
    @IsOptional()
    name: string;

    @IsOptional()
    username: string;
}