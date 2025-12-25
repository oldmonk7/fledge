import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Employee } from './employee.entity';
import { Transaction } from './transaction.entity';

@Entity('fsa_accounts')
export class FSAAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id' })
  employeeId: string;

  @Column({ name: 'account_type', default: 'DCFSA' })
  accountType: 'DCFSA';

  @Column({ name: 'annual_limit', type: 'decimal', precision: 10, scale: 2 })
  annualLimit: number;

  @Column({ name: 'current_balance', type: 'decimal', precision: 10, scale: 2, default: 0 })
  currentBalance: number;

  @Column({ name: 'used_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  usedAmount: number;

  @Column({ name: 'plan_year_start', type: 'date' })
  planYearStart: Date;

  @Column({ name: 'plan_year_end', type: 'date' })
  planYearEnd: Date;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'suspended'], default: 'active' })
  status: 'active' | 'inactive' | 'suspended';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Employee, employee => employee.fsaAccounts)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @OneToMany(() => Transaction, transaction => transaction.fsaAccount)
  transactions: Transaction[];
}
