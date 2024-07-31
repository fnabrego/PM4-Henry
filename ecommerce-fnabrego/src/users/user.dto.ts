import { ApiHideProperty } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength, Validate } from "class-validator";
import { MatchPassword } from "../decorators/matchPassword.decorator";

export class CreateUserDto {

    /**
     *Debe ser un string de máximo 50 caracteres
     *@example 'User Test'
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name: string;

    /**
     *Debe ser un string de máximo 50 caracteres con un email válido
     *@example 'usertest@mail.com'
     */
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(50)
    email: string;

    /**
     *Debe ser un string de entre 8 y 20 caracteres, con al menos una minúscula, una mayúscular y un caracter especial
     *@example 'Password!Test'
     */
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,20}$/)
    password: string;

    /**
     *Debe ser igual al password
     *@example 'Password!Test'
     */
    @IsNotEmpty()
    @Validate(MatchPassword, ['password'])
    confirmPassword: string;

    /**
     *Debe ser un string de entre 3 y 80 caracteres
     *@example 'Av Libertador 1454'
     */
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(80)
    address: string;

    /**
     *Debe ser un number
     *@example 5412356488
     */
    @IsNotEmpty()
    @IsNumber()
    phone: number;

    /**
     *Debe ser un string de entre 4 y 20 caracteres
     *@example 'Argentina'
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    country: string;

    /**
     *Debe ser un string de entre 4 y 20 caracteres
     *@example 'Mendoza'
     */
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    city: string;

    @ApiHideProperty()
    @IsEmpty()
    isAdmin: boolean;

}

export class LogginUserDto {

    /**
     *Debe ser un string de máximo 50 caracteres con un email válido
     *@example 'mariagarcia@example.com'
     */
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(50)
    email: string;

    /**
     *Debe ser un string de entre 8 y 20 caracteres, con al menos una minúscula, una mayúscular y un caracter especial
     *@example 'Password2!'
     */
    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]/)
    password: string;

}