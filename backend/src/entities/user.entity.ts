import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';
import { PlaidItem } from './plaid-item.entity';

export type UserRole = 'admin' | 'employee';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'employee'],
    default: 'employee'
  })
  role: UserRole;

  @Column({ nullable: true })
  department?: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // One-to-one relationship with Employee (only for users with employee role)
  @OneToOne(() => Employee, employee => employee.user, { nullable: true })
  employee?: Employee;

  // One-to-many relationship with PlaidItem
  @OneToMany(() => PlaidItem, plaidItem => plaidItem.user)
  plaidItems?: PlaidItem[];

  // Helper method to get full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Helper method to check if user is admin
  get isAdmin(): boolean {
    return this.role === 'admin';
  }

  // Helper method to check if user is employee
  get isEmployee(): boolean {
    return this.role === 'employee';
  }
}
