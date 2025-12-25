export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  department?: string;
  hireDate: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  fsaAccounts?: FSAAccount[];
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

