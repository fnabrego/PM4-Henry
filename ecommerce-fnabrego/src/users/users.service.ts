import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UserRepository
    ) { }

    getUsers(page?: number, limit?: number) {
        return this.usersRepository.getUsers(page, limit)
    }
    getById(id: string) {
        return this.usersRepository.getById(id)
    }

    updateUser(id: string, user: Partial<Users>) {
        return this.usersRepository.updateUser(id, user)
    }
    deleteUser(id: string) {
        return this.usersRepository.deleteUser(id)
    }
}
