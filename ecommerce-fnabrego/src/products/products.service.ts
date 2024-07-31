import { Injectable } from '@nestjs/common';
import { ProductRepository } from './products.repository';
import { Products } from 'src/entities/products.entity';

@Injectable()
export class ProductsService {
    constructor(private readonly productsRepository: ProductRepository) { }
    
    getProducts(page?: number, limit?: number) {
        return this.productsRepository.getProducts(page, limit)
    }
    getProduct(id: string) {
        return this.productsRepository.getById(id);
    }
    addProducts() {
        return this.productsRepository.addProducts();
    }
    newProduct(product: Products) {
        return this.productsRepository.newProduct(product);
    }
    updateProduct(id: string, product: Partial<Products>) {
        return this.productsRepository.updateProduct(id, product);
    }
    deleteProduct(id: string) {
        return this.productsRepository.deleteProduct(id);
    }
}
