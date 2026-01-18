import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { FSAAccount } from './fsa-account.entity';
import { User } from './user.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Reference to the User entity
  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'employee_id', unique: true })
  employeeId: string;

  @Column({ name: 'hire_date', type: 'date' })
  hireDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => FSAAccount, fsaAccount => fsaAccount.employee)
  fsaAccounts: FSAAccount[];

  // Computed properties for backward compatibility
  get firstName(): string {
    return this.user.firstName;
  }

  get lastName(): string {
    return this.user.lastName;
  }

  get email(): string {
    return this.user.email;
  }

  get department(): string | undefined {
    return this.user.department;
  }

  get fullName(): string {
    return this.user.fullName;
  }
}
