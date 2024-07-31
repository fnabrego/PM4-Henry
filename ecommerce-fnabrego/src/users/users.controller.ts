import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Put, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateUserDto } from './user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ApiBearerAuth()
    @HttpCode(200)
    @Get(':id')
    @UseGuards(AuthGuard)
    getUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.getById(id)
    }

    @ApiBearerAuth()
    @HttpCode(200)
    @Get()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    getUsers(@Query('page') page?: string, @Query('limit') limit?: string) {
        if (!page || !limit) return this.usersService.getUsers()
        const pageInt = Number(page);
        const limitInt = Number(limit);
        return this.usersService.getUsers(pageInt, limitInt)
    }

    @ApiBearerAuth()
    @HttpCode(200)
    @Put(':id')
    @UseGuards(AuthGuard)
    updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() user: Partial<CreateUserDto>) {
        return this.usersService.updateUser(id, user)
    }

    @ApiBearerAuth()
    @HttpCode(200)
    @Delete(':id')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.deleteUser(id)
    }
}
