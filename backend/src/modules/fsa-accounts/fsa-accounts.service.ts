import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { FSAAccount } from '../../entities/fsa-account.entity';
import { Transaction } from '../../entities/transaction.entity';

@Injectable()
export class FSAAccountsService {
  constructor(
    @InjectRepository(FSAAccount)
    private fsaAccountRepository: Repository<FSAAccount>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectDataSource()
    private dataSource: DataSource,
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

  async allocate(id: string, amount: number, description?: string): Promise<FSAAccount> {
    if (amount <= 0) {
      throw new BadRequestException('Allocation amount must be greater than 0');
    }

    const fsaAccount = await this.fsaAccountRepository.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!fsaAccount) {
      throw new NotFoundException(`FSA Account with ID ${id} not found`);
    }

    if (fsaAccount.status !== 'active') {
      throw new BadRequestException('Cannot allocate to an inactive account');
    }

    // Calculate new balance after allocation
    const newBalance = Number(fsaAccount.currentBalance) + amount;
    const totalAllocated = newBalance;

    // Check if allocation would exceed annual limit
    if (totalAllocated > Number(fsaAccount.annualLimit)) {
      throw new BadRequestException(
        `Allocation would exceed annual limit. Current balance: $${fsaAccount.currentBalance}, Annual limit: $${fsaAccount.annualLimit}, Attempted allocation: $${amount}`
      );
    }

    // Use transaction to ensure data consistency
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update FSA account balance
      fsaAccount.currentBalance = newBalance;
      await queryRunner.manager.save(FSAAccount, fsaAccount);

      // Create credit transaction
      const transaction = this.transactionRepository.create({
        fsaAccountId: id,
        amount,
        description: description || `Allocation of $${amount.toFixed(2)}`,
        transactionDate: new Date(),
        transactionType: 'credit',
        status: 'approved',
      });

      await queryRunner.manager.save(Transaction, transaction);

      await queryRunner.commitTransaction();

      // Return updated account with transaction
      return this.fsaAccountRepository.findOne({
        where: { id },
        relations: ['employee', 'transactions'],
      }) as Promise<FSAAccount>;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
