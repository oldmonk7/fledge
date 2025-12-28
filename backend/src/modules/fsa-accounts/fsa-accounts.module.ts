import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FSAAccountsService } from './fsa-accounts.service';
import { FSAAccountsController } from './fsa-accounts.controller';
import { FSAAccount } from '../../entities/fsa-account.entity';
import { Transaction } from '../../entities/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FSAAccount, Transaction])],
  controllers: [FSAAccountsController],
  providers: [FSAAccountsService],
  exports: [FSAAccountsService],
})
export class FSAAccountsModule {}
