import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderDetails } from "src/entities/orderdetails.entity";
import { Orders } from "src/entities/orders.entity";
import { Products } from "src/entities/products.entity";
import { Users } from "src/entities/users.entity";
import { Repository } from "typeorm";

@Injectable()
export class OrdersRepository {
    constructor(
        @InjectRepository(Orders) private ordersRepo: Repository<Orders>,
        @InjectRepository(Users) private usersRepo: Repository<Users>,
        @InjectRepository(Products) private productsRepo: Repository<Products>,
        @InjectRepository(OrderDetails) private orderDetailRepo: Repository<OrderDetails>
    ) { }

    async getOrder(id: string) {
        const order = await this.ordersRepo.findOne({
            where: { id },
            relations: ['orderDetails', 'orderDetails.products']
        }
        );
        if (!order) throw new NotFoundException(`Orden con id ${id} no encontrada`);
        return order;
    }
    async addOrder(userId: string, products: Partial<Products[]>) {
        let total = 0;

        const user = await this.usersRepo.findOneBy({ id: userId });
        if (!user) throw new NotFoundException(`Usuario con id ${userId} no encontrado`);

        const productsArray = await Promise.all(
            products.map(async (element) => {
                const product = await this.productsRepo.findOne({
                    where: { id: element.id }
                });

                if (!product) throw new NotFoundException('producto no encontrado');
                if (product.stock < 1) throw new NotFoundException(`El stock de ${product.name} no es sufuciente`)

                total += Number(product.price);

                await this.productsRepo.update(
                    { id: element.id },
                    { stock: product.stock - 1 }
                );
                return product;
            })
        )

        const order = new Orders();
        order.date = new Date();
        order.user = user;
        const newOrder = await this.ordersRepo.save(order);

        const orderDetails = new OrderDetails();
        orderDetails.price = Number(Number(total).toFixed(2));
        orderDetails.order = newOrder;
        orderDetails.products = productsArray;
        console.log(orderDetails)
        await this.orderDetailRepo.save(orderDetails);

        const devolucion = await this.ordersRepo
            .createQueryBuilder('orders')
            .leftJoinAndSelect('orders.orderDetails', 'orderDetails')
            .where('orders.id = :id', { id: newOrder.id })
            .getOne();
        return devolucion;
    }
}