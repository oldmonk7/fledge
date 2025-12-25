import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { FSAAccount } from './fsa-account.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'employee_id', unique: true })
  employeeId: string;

  @Column({ nullable: true })
  department?: string;

  @Column({ name: 'hire_date', type: 'date' })
  hireDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => FSAAccount, fsaAccount => fsaAccount.employee)
  fsaAccounts: FSAAccount[];
}
