import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OrderResponseDto } from "./dto/response/order-response.dto";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { CreateOrderRequestDto } from "./dto/request/create-order-request.dto";
import { CreateOrderModel } from "./models/create-order.model";
import { OrderService } from "./order.service";

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderControlller {
    constructor(private readonly orderService: OrderService){}

    @Get()
    async findAll(): Promise<OrderResponseDto[]>{
        const orders = await this.orderService.findAll();
        return orders.map(OrderResponseDto.fromModel)
    }

    @Get('my')
    async findMyOrders(@CurrentUser() currentUser: {id: string}): Promise<OrderResponseDto[]>{
        const orders = await this.orderService.findMyOrders(currentUser.id);
        return orders.map(OrderResponseDto.fromModel)
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<OrderResponseDto>{
        const order = await this.orderService.findById(id)
        return OrderResponseDto.fromModel(order)
    }

    
    @Post()
    async create(@Body() dto: CreateOrderRequestDto, @CurrentUser() currentUser: {id: string}): Promise<OrderResponseDto>{
        const model = new CreateOrderModel();
        model.title = dto.title;
        model.description = dto.description ?? '';
        model.userId = currentUser.id;

        const order = await this.orderService.create(model);
        return OrderResponseDto.fromModel(order);
    }
}