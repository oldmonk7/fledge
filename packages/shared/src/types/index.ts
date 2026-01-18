export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  lastLoginAt?: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  employee?: Employee;
}

export interface Employee {
  id: string;
  userId: string;
  employeeId: string;
  hireDate: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  fsaAccounts?: FSAAccount[];
  // Computed properties from User
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  fullName: string;
}

export interface FSAAccount {
  id: string;
  employeeId: string;
  accountType: 'DCFSA';
  annualLimit: number;
  currentBalance: number;
  usedAmount: number;
  planYearStart: Date | string;
  planYearEnd: Date | string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface EmployeeWithFSA extends Employee {
  fsaAccount: FSAAccount;
}

export interface AggregateUsage {
  totalEmployees: number;
  totalAnnualLimit: number;
  totalUsedAmount: number;
  totalRemainingBalance: number;
  averageUsagePercentage: number;
  activeAccounts: number;
  inactiveAccounts: number;
}

export interface Transaction {
  id: string;
  fsaAccountId: string;
  amount: number;
  description: string;
  transactionDate: Date | string;
  transactionType: 'debit' | 'credit';
  category?: string;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date | string;
  updatedAt: Date | string;
}

