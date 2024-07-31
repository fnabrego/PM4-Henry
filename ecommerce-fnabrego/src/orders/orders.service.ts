import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { Products } from 'src/entities/products.entity';

@Injectable()
export class OrdersService {
    constructor(private readonly ordersRepository: OrdersRepository) { }
    getOrder(id: string) {
        return this.ordersRepository.getOrder(id);
    }
    addOrder(userId: string, products: Partial<Products[]>) {
        return this.ordersRepository.addOrder(userId, products)
    }
}
