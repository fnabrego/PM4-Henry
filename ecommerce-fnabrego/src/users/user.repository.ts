import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "src/entities/users.entity";
import { Repository } from "typeorm";

function UserNoPassword(object: Partial<Users>): Partial<Users> {
    const { password, ...cleanPassword } = object;
    return cleanPassword;
}
function UsersNoPassword(array: Partial<Users[]>): Partial<Users>[] {
    const cleanPassword = array.map(({ password, ...cleanPassword }) => cleanPassword)
    return cleanPassword;
}
function UserNoRoles(object: Partial<Users>): Partial<Users> {
    const { isAdmin, ...cleanRole } = object;
    return cleanRole;
}
function UsersNoRoles(array: Partial<Users[]>): Partial<Users>[] {
    const cleanRoleUsers = array.map(({ isAdmin, ...cleanRole }) => cleanRole);
    return cleanRoleUsers;
}
@Injectable()
export class UserRepository {
    constructor(@InjectRepository(Users) private usersRepo: Repository<Users>) { }

    async getUsers(page?: number, limit?: number) {
        if (!page || !limit) {
            const allUsers = await this.usersRepo.find({ relations: { orders: true } });
            return UsersNoPassword(allUsers);
        }

        const skip = (page - 1) * limit;
        const users = await this.usersRepo.find({
            relations: { orders: true },
            take: limit,
            skip: skip,
        });
        return UsersNoPassword(users);
    }

    async getById(id: string) {
        const user = await this.usersRepo.findOne({
            where: { id },
            relations: { orders: true }
        });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        return UserNoRoles(UserNoPassword(user));
    }

    async addUser(user: Partial<Users>) {
        const newUser = await this.usersRepo.save(user);
        if (!newUser) throw new InternalServerErrorException('No se puedo crear el usuario')
        const { password, ...userNoPassword } = user;
        return userNoPassword;
    }

    async updateUser(id: string, user: Partial<Users>) {
        const userIs = await this.usersRepo.findOne({
            where: { id },
            relations: { orders: true }
        });

        if (!userIs) throw new NotFoundException('Usuario no encontrado');

        await this.usersRepo.update(id, user);
        const updateUser = await this.usersRepo.findOneBy({ id });
        return updateUser.id;
    }

    async deleteUser(id: string) {
        const user = await this.usersRepo.findOne({
            where: { id },
            relations: { orders: true }
        });

        if (!user) throw new NotFoundException('Usuario no encontrado');

        this.usersRepo.remove(user);
        return user.id;
    }

    async getUserByEmail(email: string): Promise<Users> {
        return await this.usersRepo.findOneBy({ email });
    }
}