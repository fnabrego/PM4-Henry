import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
    constructor(private categoriesRepo: CategoriesRepository) { }

    addCategories() {
        return this.categoriesRepo.addCategories();
    }
    getCategories() {
        return this.categoriesRepo.getCategories();
    }
}
