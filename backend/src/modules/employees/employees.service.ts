import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../../entities/employee.entity';
import { EmployeeWithFSA } from '@fledge/shared';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find({
      relations: ['fsaAccounts'],
    });
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['fsaAccounts'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async findOneWithFSA(id: string): Promise<EmployeeWithFSA> {

    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: ['fsaAccounts'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    // For now, we'll assume there's only one FSA account per employee
    const fsaAccount = employee.fsaAccounts[0];
    if (!fsaAccount) {
      throw new NotFoundException(`No FSA account found for employee ${id}`);
    }

    return {
      ...employee,
      fsaAccount,
    };
  }

  async findByEmployeeId(employeeId: string): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({
      where: { employeeId },
      relations: ['fsaAccounts'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with employee ID ${employeeId} not found`);
    }

    return employee;
  }
}
