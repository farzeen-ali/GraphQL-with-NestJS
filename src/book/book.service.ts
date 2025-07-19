import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from './model/book.model';
import { Model } from 'mongoose';
import { CreateBookInput } from './dto/create-book.input';
import { UpdateBookInput } from './dto/update-book.input';

@Injectable()
export class BookService {
    constructor(@InjectModel(Book.name) private bookModel: Model<Book>){}

    async create(input: CreateBookInput): Promise<Book> {
        const created = new this.bookModel(input);
        return created.save();
    }

    async findAll(): Promise<Book[]> {
        return this.bookModel.find().exec();
    }

    async findOne(id: string): Promise<Book> {
        const book = await this.bookModel.findById(id).exec();
        if(!book) throw new NotFoundException('Book not Found!')
        return book;
    }

    async update(input: UpdateBookInput): Promise<Book> {
        const existingBook = await this.bookModel.findById(input.id);
        if(!existingBook) throw new NotFoundException('Book not Found!')
        Object.assign(existingBook, input);
        return existingBook.save();
    }

    async remove(id: string): Promise<boolean> {
        const result = await this.bookModel.findByIdAndDelete(id);
        if(!result) throw new NotFoundException('Book not Found!')
        return true;
    }

}
