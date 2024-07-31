import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Products } from 'src/entities/products.entity';
import { Orders } from 'src/entities/orders.entity';
import { OrderDetails } from 'src/entities/orderdetails.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Orders, Users, Products, OrderDetails])],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrdersRepository
  ]
})
export class OrdersModule { }
