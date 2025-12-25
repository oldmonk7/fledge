import { Controller, Get, Param } from '@nestjs/common';
import { FSAAccountsService } from './fsa-accounts.service';

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
}
