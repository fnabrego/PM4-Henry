import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Categories } from "src/entities/categories.entity";
import { Products } from "src/entities/products.entity";
import { Repository } from "typeorm";
import * as data from '../utils/archivo.json';

@Injectable()
export class ProductRepository {
    constructor(
        @InjectRepository(Products) private productsRepo: Repository<Products>,
        @InjectRepository(Categories) private categoriesRepo: Repository<Categories>
    ) { }

    async getProducts(page?: number, limit?: number): Promise<Products[]> {
        if (!page || !limit) {
            const allProducts = await this.productsRepo.find({ relations: { category: true } });
            return allProducts;
        }

        const skip = (page - 1) * limit;
        const products = await this.productsRepo.find({
            relations: { category: true },
            take: limit,
            skip: skip,
        });
        return products;
    }

    async getById(id: string) {
        const product = await this.productsRepo.findOne(
            {
                where: { id },
                relations: { category: true }
            }
        );

        if (!product) throw new NotFoundException(`Producto con id ${id} no encontrado`);
        return product.id;
    }

    async addProducts() {
        const categories = await this.categoriesRepo.find();
        data?.map(async (element) => {
            const category = categories.find(
                (category) => category.name === element.category
            )
            const product = new Products();
            product.name = element.name;
            product.description = element.description;
            product.price = element.price;
            product.imgUrl = element.imgUrl;
            product.stock = element.stock;
            product.category = category;

            await this.productsRepo
                .createQueryBuilder()
                .insert()
                .into(Products)
                .values(product)
                .orUpdate(['description', 'price', 'imgUrl', 'stock'], ['name']
                )
                .execute();

        });
        return 'Producto agregado';
    }

    async newProduct(product: Products) {
        const productCategory = product.category.toString();
        const productName = product.name.toString();
        const categories = await this.categoriesRepo.find();
        const foundCategory = categories.find((element) => element.name === productCategory);

        async function addCategory(categoriesRepo: Repository<Categories>, name: string) {
            await categoriesRepo.save({ name: name });
        }

        if (!foundCategory) { addCategory(this.categoriesRepo, productCategory); };

        const foundNewCategory = categories.find((element) => element.name === productCategory)
        if (foundCategory) {
            const allProducts = await this.productsRepo.find();
            const foundProduct = allProducts.find((element) => element.name === productName);
            if (!foundProduct) {
                product.category = foundCategory;
                const newProduct = await this.productsRepo.save(product);
                return newProduct.id;
            } else {
                const updateProduct = new Products();
                updateProduct.name = product.name;
                updateProduct.description = product.description;
                updateProduct.price = product.price;
                updateProduct.imgUrl = product.imgUrl;
                updateProduct.stock = product.stock;
                updateProduct.category = foundNewCategory;

                await this.productsRepo
                    .createQueryBuilder()
                    .insert()
                    .into(Products)
                    .values(updateProduct)
                    .orUpdate(['description', 'price', 'imgUrl', 'stock', 'category_id'], ['name']
                    )
                    .execute();
                const updating = allProducts.find((element) => element.name === productName);
                return updating.id;
            }
        }

    }

    async updateProduct(id: string, product: Partial<Products>) {
        const existingProduct = await this.productsRepo.findOne({
            where: { id },
            relations: { category: true }
        });
        if (!existingProduct) throw new NotFoundException(`Producto con id ${id} no encontrado`);
        await this.productsRepo.update(id, product);
        return existingProduct.id;
    }

    async deleteProduct(id: string) {
        const existingProduct = await this.productsRepo.findOne({
            where: { id },
            relations: { category: true }
        });
        if (!existingProduct) throw new NotFoundException(`Producto con id ${id} no encontrado`);
        await this.productsRepo.delete(id);
        return existingProduct.id;
    }
}