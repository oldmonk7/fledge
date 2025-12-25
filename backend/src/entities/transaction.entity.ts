import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { FSAAccount } from './fsa-account.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fsa_account_id' })
  fsaAccountId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'transaction_date', type: 'date' })
  transactionDate: Date;

  @Column({ name: 'transaction_type', type: 'enum', enum: ['debit', 'credit'] })
  transactionType: 'debit' | 'credit';

  @Column({ nullable: true })
  category?: string;

  @Column({ name: 'receipt_url', nullable: true })
  receiptUrl?: string;

  @Column({ type: 'enum', enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => FSAAccount, fsaAccount => fsaAccount.transactions)
  @JoinColumn({ name: 'fsa_account_id' })
  fsaAccount: FSAAccount;
}
