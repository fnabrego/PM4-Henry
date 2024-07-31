import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/users/user.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UserRepository,
        private readonly jwtService: JwtService
    ) { }

    async signUp(userSingUp: Partial<Users>) {
        const userExist = await this.usersRepository.getUserByEmail(userSingUp.email);
        if (userExist) throw new BadRequestException('Credenciales incorrectas');

        const hashedPassword: string = await bcrypt.hash(userSingUp.password, 10);
        if (!hashedPassword) {
            throw new BadRequestException('Error al hashear contraseña');
        }

        return this.usersRepository.addUser({ ...userSingUp, password: hashedPassword });

    }

    async signIn(userSignIn: Partial<Users>) {
        const userExist = await this.usersRepository.getUserByEmail(userSignIn.email);
        if (!userExist) throw new UnauthorizedException('Credenciales incorrectas');

        const isPassword = await bcrypt.compare(userSignIn.password, userExist.password);
        if (!isPassword) throw new UnauthorizedException('Credenciales incorrectas');

        const userPayload = {
            id: userExist.id,
            email: userExist.email,
            isAdmin: userExist.isAdmin
        };

        const token = this.jwtService.sign(userPayload);

        return { message: 'login correcto', token };
    }
}
