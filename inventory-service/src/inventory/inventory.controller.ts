import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guards';
import { CreateProductRequestDto } from './dto/request/create-product-request.dto';
import { UpdateStockRequestDto } from './dto/request/update-stock-request.dto';
import { ProductListResponseDto } from './dto/response/product-list-response.dto';
import { ProductDetailResponseDto } from './dto/response/product-detail-response.dto';
import { CreateProductModel } from './models/create-product.model';
import { UpdateStockModel } from './models/update-stock.model';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // GET /inventory
  @Get()
  async findAll(): Promise<ProductListResponseDto[]> {
    const items = await this.inventoryService.findAll();
    return items.map(ProductListResponseDto.fromModel);
  }

  // GET /inventory/:id
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ProductDetailResponseDto> {
    const item = await this.inventoryService.findById(id);
    return ProductDetailResponseDto.fromModel(item);
  }

  // POST /inventory — DTO validated here, Model passed to service
  @Post()
  async create(@Body() dto: CreateProductRequestDto): Promise<ProductDetailResponseDto> {
    const model = new CreateProductModel();
    model.name = dto.name;
    model.description = dto.description ?? '';
    model.stock = dto.stock;
    model.price = dto.price;

    const item = await this.inventoryService.create(model);
    return ProductDetailResponseDto.fromModel(item);
  }

  // PATCH /inventory/:id/stock — DTO validated here, Model passed to service
  @Patch(':id/stock')
  async updateStock(
    @Param('id') id: string,
    @Body() dto: UpdateStockRequestDto,
  ): Promise<ProductDetailResponseDto> {
    const model = new UpdateStockModel();
    model.stock = dto.stock;

    const item = await this.inventoryService.updateStock(id, model);
    return ProductDetailResponseDto.fromModel(item);
  }
}