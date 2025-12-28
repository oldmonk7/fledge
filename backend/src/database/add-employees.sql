-- Add 10 more employees with FSA accounts
-- This script adds additional demo data for testing aggregate usage

-- Employee 2
INSERT INTO employees (id, first_name, last_name, email, employee_id, department, hire_date, created_at, updated_at)
VALUES (
  'b2c3d4e5-f6a7-4890-b123-c5d6e7f8a900',
  'Jane',
  'Smith',
  'jane.smith@company.com',
  'EMP002',
  'Marketing',
  '2023-03-20',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

INSERT INTO fsa_accounts (id, employee_id, account_type, annual_limit, current_balance, used_amount, plan_year_start, plan_year_end, status, created_at, updated_at)
VALUES (
  'a2b3c4d5-e6f7-4890-1234-567890abcde0',
  'b2c3d4e5-f6a7-4890-b123-c5d6e7f8a900',
  'DCFSA',
  5000.00,
  2500.00,
  2500.00,
  '2024-01-01',
  '2024-12-31',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Employee 3
INSERT INTO employees (id, first_name, last_name, email, employee_id, department, hire_date, created_at, updated_at)
VALUES (
  'c3d4e5f6-a7b8-4901-c234-d6e7f8a9b001',
  'Michael',
  'Johnson',
  'michael.johnson@company.com',
  'EMP003',
  'Sales',
  '2022-11-10',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

INSERT INTO fsa_accounts (id, employee_id, account_type, annual_limit, current_balance, used_amount, plan_year_start, plan_year_end, status, created_at, updated_at)
VALUES (
  'b3c4d5e6-f7a8-4901-2345-678901bcde00',
  'c3d4e5f6-a7b8-4901-c234-d6e7f8a9b001',
  'DCFSA',
  5000.00,
  1000.00,
  4000.00,
  '2024-01-01',
  '2024-12-31',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Employee 4
INSERT INTO employees (id, first_name, last_name, email, employee_id, department, hire_date, created_at, updated_at)
VALUES (
  'd4e5f6a7-b8c9-4012-d345-e7f8a9b0c002',
  'Emily',
  'Williams',
  'emily.williams@company.com',
  'EMP004',
  'HR',
  '2023-06-15',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

INSERT INTO fsa_accounts (id, employee_id, account_type, annual_limit, current_balance, used_amount, plan_year_start, plan_year_end, status, created_at, updated_at)
VALUES (
  'c4d5e6f7-a8b9-4012-3456-789012cdef00',
  'd4e5f6a7-b8c9-4012-d345-e7f8a9b0c002',
  'DCFSA',
  5000.00,
  4500.00,
  500.00,
  '2024-01-01',
  '2024-12-31',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Employee 5
INSERT INTO employees (id, first_name, last_name, email, employee_id, department, hire_date, created_at, updated_at)
VALUES (
  'e5f6a7b8-c9d0-4123-e456-f8a9b0c1d003',
  'David',
  'Brown',
  'david.brown@company.com',
  'EMP005',
  'Engineering',
  '2023-09-01',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

INSERT INTO fsa_accounts (id, employee_id, account_type, annual_limit, current_balance, used_amount, plan_year_start, plan_year_end, status, created_at, updated_at)
VALUES (
  'd5e6f7a8-b9c0-4123-4567-890123defa00',
  'e5f6a7b8-c9d0-4123-e456-f8a9b0c1d003',
  'DCFSA',
  5000.00,
  5000.00,
  0.00,
  '2024-01-01',
  '2024-12-31',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Employee 6
INSERT INTO employees (id, first_name, last_name, email, employee_id, department, hire_date, created_at, updated_at)
VALUES (
  'f6a7b8c9-d0e1-4234-f567-a9b0c1d2e004',
  'Sarah',
  'Davis',
  'sarah.davis@company.com',
  'EMP006',
  'Finance',
  '2022-05-12',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

INSERT INTO fsa_accounts (id, employee_id, account_type, annual_limit, current_balance, used_amount, plan_year_start, plan_year_end, status, created_at, updated_at)
VALUES (
  'e6f7a8b9-c0d1-4234-5678-901234efab00',
  'f6a7b8c9-d0e1-4234-f567-a9b0c1d2e004',
  'DCFSA',
  5000.00,
  3200.00,
  1800.00,
  '2024-01-01',
  '2024-12-31',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Employee 7
INSERT INTO employees (id, first_name, last_name, email, employee_id, department, hire_date, created_at, updated_at)
VALUES (
  'a7b8c9d0-e1f2-4345-a678-b0c1d2e3f005',
  'Robert',
  'Miller',
  'robert.miller@company.com',
  'EMP007',
  'Operations',
  '2023-02-28',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

INSERT INTO fsa_accounts (id, employee_id, account_type, annual_limit, current_balance, used_amount, plan_year_start, plan_year_end, status, created_at, updated_at)
VALUES (
  'f7a8b9c0-d1e2-4345-6789-012345fabc00',
  'a7b8c9d0-e1f2-4345-a678-b0c1d2e3f005',
  'DCFSA',
  5000.00,
  1500.00,
  3500.00,
  '2024-01-01',
  '2024-12-31',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Employee 8
INSERT INTO employees (id, first_name, last_name, email, employee_id, department, hire_date, created_at, updated_at)
VALUES (
  'b8c9d0e1-f2a3-4456-b789-c1d2e3f4a006',
  'Lisa',
  'Wilson',
  'lisa.wilson@company.com',
  'EMP008',
  'Product',
  '2023-08-22',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

INSERT INTO fsa_accounts (id, employee_id, account_type, annual_limit, current_balance, used_amount, plan_year_start, plan_year_end, status, created_at, updated_at)
VALUES (
  'a8b9c0d1-e2f3-4456-7890-123456abcd00',
  'b8c9d0e1-f2a3-4456-b789-c1d2e3f4a006',
  'DCFSA',
  5000.00,
  4200.00,
  800.00,
  '2024-01-01',
  '2024-12-31',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Employee 9
INSERT INTO employees (id, first_name, last_name, email, employee_id, department, hire_date, created_at, updated_at)
VALUES (
  'c9d0e1f2-a3b4-4567-c890-d2e3f4a5b007',
  'James',
  'Moore',
  'james.moore@company.com',
  'EMP009',
  'Engineering',
  '2022-12-05',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

INSERT INTO fsa_accounts (id, employee_id, account_type, annual_limit, current_balance, used_amount, plan_year_start, plan_year_end, status, created_at, updated_at)
VALUES (
  'b9c0d1e2-f3a4-4567-8901-234567bcde00',
  'c9d0e1f2-a3b4-4567-c890-d2e3f4a5b007',
  'DCFSA',
  5000.00,
  2800.00,
  2200.00,
  '2024-01-01',
  '2024-12-31',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Employee 10
INSERT INTO employees (id, first_name, last_name, email, employee_id, department, hire_date, created_at, updated_at)
VALUES (
  'd0e1f2a3-b4c5-4678-d901-e3f4a5b6c008',
  'Jennifer',
  'Taylor',
  'jennifer.taylor@company.com',
  'EMP010',
  'Marketing',
  '2023-04-18',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

INSERT INTO fsa_accounts (id, employee_id, account_type, annual_limit, current_balance, used_amount, plan_year_start, plan_year_end, status, created_at, updated_at)
VALUES (
  'c0d1e2f3-a4b5-4678-9012-345678cdef00',
  'd0e1f2a3-b4c5-4678-d901-e3f4a5b6c008',
  'DCFSA',
  5000.00,
  3800.00,
  1200.00,
  '2024-01-01',
  '2024-12-31',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Employee 11
INSERT INTO employees (id, first_name, last_name, email, employee_id, department, hire_date, created_at, updated_at)
VALUES (
  'e1f2a3b4-c5d6-4789-e012-f4a5b6c7d009',
  'Christopher',
  'Anderson',
  'christopher.anderson@company.com',
  'EMP011',
  'Sales',
  '2023-07-30',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

INSERT INTO fsa_accounts (id, employee_id, account_type, annual_limit, current_balance, used_amount, plan_year_start, plan_year_end, status, created_at, updated_at)
VALUES (
  'd1e2f3a4-b5c6-4789-0123-456789defa00',
  'e1f2a3b4-c5d6-4789-e012-f4a5b6c7d009',
  'DCFSA',
  5000.00,
  2000.00,
  3000.00,
  '2024-01-01',
  '2024-12-31',
  'inactive',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

