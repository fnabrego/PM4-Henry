import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Categories } from "src/entities/categories.entity";
import { Repository } from "typeorm";
import * as data from '../utils/archivo.json';

@Injectable()
export class CategoriesRepository {
    constructor(
        @InjectRepository(Categories) private categoriesRepo: Repository<Categories>
    ) { }

    async getCategories() {
        return await this.categoriesRepo.find();
    }
    async addCategories() {
        data?.map(async (element) => {
            await this.categoriesRepo
                .createQueryBuilder()
                .insert()
                .into(Categories)
                .values({ name: element.category })
                .orIgnore()
                .execute();
        });
        return 'Categorias agregadas';
    }
}