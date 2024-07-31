import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryRepository } from './cloudinary.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/entities/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CloudinaryService {
    constructor(private readonly cloudinaryRepository: CloudinaryRepository,
        @InjectRepository(Products)
        private readonly productsRepository: Repository<Products>
    ) { }

    async uploadImage(file: Express.Multer.File, id: string) {
        const product = await this.productsRepository.findOneBy({ id });
        if (!product) throw new NotFoundException(`Producto con id ${id} no encontrado`);

        const response = await this.cloudinaryRepository.uploadImage(file);

        const updating = await this.productsRepository.update(id, { imgUrl: response.secure_url });
        if (!updating) throw new NotFoundException(`No se pudo carga imagen en DB`);

        const foundProduct = await this.productsRepository.findOneBy({ id: id });

        return foundProduct;
    }
}
