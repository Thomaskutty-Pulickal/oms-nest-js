import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsArray, ValidateNested } from 'class-validator';

export class OrderItemDto {
  @IsNotEmpty()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
