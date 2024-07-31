import { Body, Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { DateAdderInterceptor } from 'src/interceptors/dateAdder.interceptor';
import { CreateUserDto, LogginUserDto } from 'src/users/user.dto';
import { EmailInterceptor } from '../interceptors/emailLowercase.interceptor';


@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(201)
    @Post('signup')
    @UseInterceptors(DateAdderInterceptor)
    @UseInterceptors(EmailInterceptor)
    newUser(@Body() user: CreateUserDto) {
        delete user.confirmPassword;
        return this.authService.signUp(user)
    }

    @HttpCode(200)
    @Post('signin')
    signIn(@Body() user: LogginUserDto) {
        return this.authService.signIn(user);
    }

}