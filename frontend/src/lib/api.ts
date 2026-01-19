import { EmployeeWithFSA, Employee, FSAAccount, AggregateUsage, User } from '@fledge/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  accessToken?: string;
  message: string;
}

export class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getEmployee(id: string): Promise<Employee> {
    return this.request<Employee>(`/api/employees/${id}`);
  }

  async getEmployeeWithFSA(id: string): Promise<EmployeeWithFSA> {
    return this.request<EmployeeWithFSA>(`/api/employees/${id}/account`);
  }

  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee> {
    return this.request<Employee>(`/api/employees/by-employee-id/${employeeId}`);
  }

  async getAllEmployees(): Promise<Employee[]> {
    return this.request<Employee[]>('/api/employees');
  }

  async getFSAAccount(id: string): Promise<FSAAccount> {
    return this.request<FSAAccount>(`/api/fsa-accounts/${id}`);
  }

  async getFSAAccountsByEmployee(employeeId: string): Promise<FSAAccount[]> {
    return this.request<FSAAccount[]>(`/api/fsa-accounts/employee/${employeeId}`);
  }

  async getActiveFSAAccountByEmployee(employeeId: string): Promise<FSAAccount | null> {
    return this.request<FSAAccount | null>(`/api/fsa-accounts/employee/${employeeId}/active`);
  }

  async getAggregateUsage(): Promise<AggregateUsage> {
    return this.request<AggregateUsage>('/api/employees/aggregate/usage');
  }

  async allocateToFSA(fsaAccountId: string, amount: number, description?: string): Promise<FSAAccount> {
    return this.request<FSAAccount>(`/api/fsa-accounts/${fsaAccountId}/allocate`, {
      method: 'POST',
      body: JSON.stringify({ amount, description }),
    });
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(signupData: SignupRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/auth/logout', {
      method: 'POST',
    });
  }

  // Plaid methods
  async createPlaidLinkToken(userId: string): Promise<{ link_token: string }> {
    return this.request<{ link_token: string }>(`/api/plaid/link-token/${userId}`, {
      method: 'POST',
    });
  }

  async exchangePlaidToken(userId: string, publicToken: string): Promise<any> {
    return this.request(`/api/plaid/exchange-token/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ public_token: publicToken }),
    });
  }

  async getPlaidTransactions(userId: string, startDate?: string, endDate?: string): Promise<any> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const queryString = params.toString();
    return this.request(`/api/plaid/transactions/${userId}${queryString ? `?${queryString}` : ''}`);
  }

  async getPlaidItems(userId: string): Promise<any[]> {
    return this.request<any[]>(`/api/plaid/items/${userId}`);
  }

  async removePlaidItem(userId: string, itemId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/api/plaid/items/${userId}/${itemId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
