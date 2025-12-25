import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FSAAccount } from '../../entities/fsa-account.entity';

@Injectable()
export class FSAAccountsService {
  constructor(
    @InjectRepository(FSAAccount)
    private fsaAccountRepository: Repository<FSAAccount>,
  ) {}

  async findAll(): Promise<FSAAccount[]> {
    return this.fsaAccountRepository.find({
      relations: ['employee', 'transactions'],
    });
  }

  async findOne(id: string): Promise<FSAAccount> {
    const fsaAccount = await this.fsaAccountRepository.findOne({
      where: { id },
      relations: ['employee', 'transactions'],
    });

    if (!fsaAccount) {
      throw new NotFoundException(`FSA Account with ID ${id} not found`);
    }

    return fsaAccount;
  }

  async findByEmployeeId(employeeId: string): Promise<FSAAccount[]> {
    return this.fsaAccountRepository.find({
      where: { employeeId },
      relations: ['employee', 'transactions'],
      order: { planYearStart: 'DESC' },
    });
  }

  async findActiveByEmployeeId(employeeId: string): Promise<FSAAccount | null> {
    return this.fsaAccountRepository.findOne({
      where: {
        employeeId,
        status: 'active',
      },
      relations: ['employee', 'transactions'],
      order: { planYearStart: 'DESC' },
    });
  }
}
