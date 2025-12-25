-- Database initialization script for demo data
-- Note: This script assumes the database and user already exist
-- For Docker: POSTGRES_USER environment variable automatically creates the user
-- For local setup: Run setup-db.sh first to create the user and database

-- Create database and tables (if not using TypeORM sync)
-- Note: TypeORM will handle table creation in development, but this ensures demo data is seeded

-- Insert demo employee
INSERT INTO employees (id, first_name, last_name, email, employee_id, department, hire_date, created_at, updated_at)
VALUES (
  'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789',
  'John',
  'Doe',
  'john.doe@company.com',
  'EMP001',
  'Engineering',
  '2023-01-15',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Insert demo FSA account (2024 plan year)
INSERT INTO fsa_accounts (id, employee_id, account_type, annual_limit, current_balance, used_amount, plan_year_start, plan_year_end, status, created_at, updated_at)
VALUES (
  'f1e2d3c4-b5a6-4987-9012-3456789abcde',
  'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789',
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

-- Insert some demo transactions
INSERT INTO transactions (id, fsa_account_id, amount, description, transaction_date, transaction_type, category, status, created_at, updated_at)
VALUES
  ('11111111-2222-4333-8444-555555555555', 'f1e2d3c4-b5a6-4987-9012-3456789abcde', 250.00, 'Daycare payment - January', '2024-01-15', 'debit', 'childcare', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('22222222-3333-4444-8555-666666666666', 'f1e2d3c4-b5a6-4987-9012-3456789abcde', 350.00, 'After school program - February', '2024-02-01', 'debit', 'childcare', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('33333333-4444-4555-8666-777777777777', 'f1e2d3c4-b5a6-4987-9012-3456789abcde', 400.00, 'Summer camp registration', '2024-03-10', 'debit', 'childcare', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('44444444-5555-4666-8777-888888888888', 'f1e2d3c4-b5a6-4987-9012-3456789abcde', 300.00, 'Child care provider - March', '2024-03-15', 'debit', 'childcare', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('55555555-6666-4777-8888-999999999999', 'f1e2d3c4-b5a6-4987-9012-3456789abcde', 500.00, 'Annual contribution', '2024-01-01', 'credit', 'contribution', 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;
