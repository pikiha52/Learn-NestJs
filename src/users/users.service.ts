import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { FilterDto } from './dto/filter-dto';
import { FormUserDto } from './dto/form-user.dto';
import * as bcrypt from 'bcrypt';
import { FormUpdateUserDto } from './dto/form-update.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async getUsers(filter: FilterDto): Promise<User[]> {
        const { name, username } = filter

        const query = this.userRepository.createQueryBuilder('user')
        if (name) {
            query.andWhere('lower(user.name) LIKE :name', {
                name: `%${name.toLowerCase()}%`,
            })
        }

        if (username) {
            query.andWhere('lower(user.username) LIKE :username', {
                username: `%${username.toLowerCase()}%`,
            })
        }

        return await query.getMany()
    }

    async createUser(formUserDto: FormUserDto): Promise<void> {
        const { name, username, password } = formUserDto
        const user = this.userRepository.create()
        user.name = name
        user.username = username
        user.salt = await bcrypt.genSalt()
        user.password = await bcrypt.hash(password, user.salt)

        try {
            await this.userRepository.save(user)
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async showUser(id: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: id })
        if (!user) {
            throw new NotFoundException(`User ${id} not found`)
        }
        return user
    }

    async updateUser(id: string, formUpdateUser: FormUpdateUserDto): Promise<void> {
        const { name, username, password } = formUpdateUser
        let user = await this.showUser(id)
        if (!user) {
            throw new NotFoundException(`User ${id} not found`)
        }

        user.name = name
        user.username = username
        if (password) {
            user.salt = await bcrypt.genSalt()
            user.password = await bcrypt.hash(password, user.salt)
        }

        try {
            await this.userRepository.save(user)
        } catch (err) {
            throw new InternalServerErrorException(err)
        }

    }

    async deleteUser(id: string): Promise<void> {
        const user = await this.showUser(id)
        if (!user) {
            throw new NotFoundException(`User ${id} not found`)
        }
        try {
            await this.userRepository.delete(user.id)
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async validateUsers(username: string, password: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ username: username })

        if (user && (await user.validatePassword(password))) {
            return user
        }

        return null
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: id })
        if (!user) {
            throw new NotFoundException(`User ${id} not found`)
        }
        return user
    }
}
