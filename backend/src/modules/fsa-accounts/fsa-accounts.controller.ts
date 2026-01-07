import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { IsNumber, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { FSAAccountsService } from './fsa-accounts.service';

export class AllocateDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0.01)
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}

@Controller('fsa-accounts')
export class FSAAccountsController {
  constructor(private readonly fsaAccountsService: FSAAccountsService) {}

  @Get()
  async findAll() {
    return this.fsaAccountsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.fsaAccountsService.findOne(id);
  }

  @Get('employee/:employeeId')
  async findByEmployeeId(@Param('employeeId') employeeId: string) {
    return this.fsaAccountsService.findByEmployeeId(employeeId);
  }

  @Get('employee/:employeeId/active')
  async findActiveByEmployeeId(@Param('employeeId') employeeId: string) {
    return this.fsaAccountsService.findActiveByEmployeeId(employeeId);
  }

  @Post(':id/allocate')
  async allocate(@Param('id') id: string, @Body() allocateDto: AllocateDto) {
    return this.fsaAccountsService.allocate(id, allocateDto.amount, allocateDto.description);
  }
}
