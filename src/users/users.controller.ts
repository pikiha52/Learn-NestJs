import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { FilterDto } from './dto/filter-dto';
import { FormUserDto } from './dto/form-user.dto';
import { UUIDValidationPipe } from 'src/pipes/uuid-validator.pipe';
import { FormUpdateUserDto } from './dto/form-update.dto';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) { }

    @Get()
    async index(@Query() filter: FilterDto, @Res() res: Response) {
        let request = await this.userService.getUsers(filter)
        res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            message: 'success',
            data: request
        })
    }

    @Post()
    async create(@Body() formDtoUser: FormUserDto, @Res() res: Response) {
        let request = await this.userService.createUser(formDtoUser)
        res.status(HttpStatus.CREATED).json({
            code: HttpStatus.CREATED,
            message:'success',
        })
    }

    @Get('/:id')
    async show(@Param('id', UUIDValidationPipe) id: string, @Res() res: Response) {
        let request = await this.userService.showUser(id)
        res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            message:'success',
            data: request
        })
    }

    @Put('/:id')
    async update(@Param('id', UUIDValidationPipe) id: string, @Body() formDtoUser: FormUpdateUserDto, @Res() res: Response) {
        let request = await this.userService.updateUser(id, formDtoUser)
        res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            message:'success',
        })
    }

    @Delete('/:id')
    async delete(@Param('id', UUIDValidationPipe) id: string, @Res() res: Response) {
        let request = await this.userService.deleteUser(id)
        res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            message:'success',
        })
    }
}
