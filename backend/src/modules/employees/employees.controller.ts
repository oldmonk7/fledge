import { Controller, Get, Param } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeeWithFSA } from '@fledge/shared';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  async findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Get(':id/account')
  async findOneWithFSA(@Param('id') id: string): Promise<EmployeeWithFSA> {
    console.log('findOne', id);
    return this.employeesService.findOneWithFSA(id);
  }

  @Get('by-employee-id/:employeeId')
  async findByEmployeeId(@Param('employeeId') employeeId: string) {
    return this.employeesService.findByEmployeeId(employeeId);
  }
}
