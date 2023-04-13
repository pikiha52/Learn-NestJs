import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import{ TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), BooksModule, UsersModule, AuthenticationModule],
})
export class AppModule {}
