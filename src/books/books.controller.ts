import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe, Res, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-books.dto';
import { FilterBookDto } from './dto/filter-books.dto';
import { Response } from 'express';
import { UUIDValidationPipe } from 'src/pipes/uuid-validator.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/authentication/get-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { JwtGuard } from 'src/guard/jwt.guard';

@Controller('books')
@UseGuards(JwtGuard)
export class BooksController {
    constructor(private booksServices: BooksService) { }
    @Get()
    async index(@Query() filter: FilterBookDto, @GetUser() user: User , @Res() res: Response) {
        res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            message: 'success',
            data: await this.booksServices.getBooks(filter)
        })
    }

    @Post()
    async create(@Body() payload : CreateBookDto, @Res() res: Response) {
        let request = await this.booksServices.storeBooks(payload)
        res.status(HttpStatus.CREATED).json({
            code: HttpStatus.CREATED,
            message:'success'
        })
    }

    @Get('/:id')
    async show(@Param('id', UUIDValidationPipe) id: string, @Res() res: Response) {
        let request = await this.booksServices.getBookById(id)
        res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            message:'success',
            data: request
        })
    }

    @Put('/:id')
    async update(@Param('id', UUIDValidationPipe) id: string, @Body() payload : CreateBookDto, @Res() res: Response) {  
        let request = await this.booksServices.updateBook(id, payload)
        res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            message:'success'
        })
    }

    @Delete('/:id')
    async delete(@Param('id', UUIDValidationPipe) id: string, @Res() res: Response) {
        let request = await this.booksServices.deleteBook(id)
        res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            message:'success'
        })
    }
} 
