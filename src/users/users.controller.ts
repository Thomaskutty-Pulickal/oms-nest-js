import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  async create(@Body() user: CreateUserDto): Promise<User> {
    return this.userService.create(user);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
