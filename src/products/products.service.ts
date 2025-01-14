import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async findOne(id: number) {
    return this.productsRepository.findOne({ where: { id } });
  }

  async findAll(minPrice?: number, maxPrice?: number): Promise<Product[]> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');

    if (minPrice) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }
    return queryBuilder.getMany();
  }

  async create(product: Product) {
    try {
      const newProduct = this.productsRepository.create(product);
      return this.productsRepository.save(newProduct);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Could not create product');
    }
  }
}
