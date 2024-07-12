import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {


  private readonly looger = new Logger("OrdersService");

  async onModuleInit() {
    await this.$connect();
    this.looger.log("DATABASE CONNECTED")
  }

  create(createOrderDto: CreateOrderDto) {

    return this.order.create({
      data: {
        ...createOrderDto
      }
    })

  }

  async findAll(paginationDto: OrderPaginationDto) {

    const totalPages = await this.order.count({
      where: {
        status: paginationDto.status
      }
    });

    const currentPage = paginationDto.page;
    const perPage = paginationDto.limit;

    return {
      data: await this.order.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        where: {
          status: paginationDto.status
        }
      }),
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage)
      }
    }

  }

  async findOne(id: string) {

    const order = await this.order.findUnique({
      where: {
        id
      }
    })

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`
      });
    }

    return order;
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {

    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne(id);
    if (order.status === status) {
      return order;
    }

    return this.order.update({
      where: { id },
      data: { status: status }
    });


  }

}
