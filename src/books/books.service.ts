import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateBookDto } from './dto/create-books.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterBookDto } from './dto/filter-books.dto';
import { Book } from './entity/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,
    ) { }

    async getBooks(filter: FilterBookDto): Promise<Book[]> {
        const { title, author, category, min_year, max_year } = filter;

        const query = this.bookRepository.createQueryBuilder('book');

        if (title) {
            query.andWhere('lower(book.title) LIKE :title', {
                title: `%${title.toLowerCase()}%`,
            });
        }

        if (author) {
            query.andWhere('lower(book.author) LIKE :author', {
                author: `%${author.toLowerCase()}`,
            });
        }

        if (category) {
            query.andWhere('lower(book.category) LIKE :category', {
                category: `%${category.toLowerCase()}`,
            });
        }

        if (min_year) {
            query.andWhere('book.year >= :min_year', { min_year });
        }

        if (max_year) {
            query.andWhere('book.year <= :max_year', { max_year });
        }

        return await query.getMany();
    }

    async storeBooks(createBookDto: CreateBookDto): Promise<void> {
        const { title, author, category, year } = createBookDto;
        let book = this.bookRepository.create()
        book.title = title;
        book.author = author;
        book.category = category;
        book.year = year;

        try {
            await this.bookRepository.save(book);
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async getBookById(bookId: string): Promise<Book> {
        const book = await this.bookRepository.findOneBy({ id: bookId })
        return book
    }

    async updateBook(bookId: string, createBookDto: CreateBookDto): Promise<void> {
        const { title, author, category, year } = createBookDto
        let book = await this.getBookById(bookId)
        if (!book) {
            throw new NotFoundException('Book not found')
        }
        
        book.title = title
        book.author = author
        book.category = category
        book.year = year

        try {
            await this.bookRepository.save(book)
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async deleteBook(bookId: string): Promise<void> {
        const book = await this.getBookById(bookId)
        if (!book) {
            throw new NotFoundException('Book not found')
        }

        try {
            await this.bookRepository.delete(book.id)
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }
}
