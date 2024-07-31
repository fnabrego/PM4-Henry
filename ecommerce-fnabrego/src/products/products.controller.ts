import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Products } from 'src/entities/products.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles/role.enum';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get('seeder')
    addProducts() {
        return this.productsService.addProducts();
    }

    @HttpCode(200)
    @Get(':id')
    getProduct(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.getProduct(id);
    }

    @HttpCode(200)
    @Get()
    @ApiQuery({ name: 'page', required: false, type: String })
    @ApiQuery({ name: 'limit', required: false, type: String })
    getProducts(@Param('page') page?: string, @Param('limit') limit?: string) {
        if (!page || !limit) return this.productsService.getProducts();
        const pageInt = Number(page);
        const limitInt = Number(limit);
        return this.productsService.getProducts(pageInt, limitInt);
    }

    @ApiBearerAuth()
    @HttpCode(201)
    @Post()
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    newProduct(@Body() product: Products) {
        return this.productsService.newProduct(product);
    }

    @ApiBearerAuth()
    @HttpCode(200)
    @Put(':id')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @UseGuards(AuthGuard)
    updateProduct(@Param('id', ParseUUIDPipe) id: string, @Body() product: Partial<Products>) {
        return this.productsService.updateProduct(id, product);
    }

    @ApiBearerAuth()
    @HttpCode(200)
    @Delete(':id')
    @Roles(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
        return this.productsService.deleteProduct(id);
    }
}
