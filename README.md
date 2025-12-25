# Fledge - DCFSA Management System

A monorepo application for managing Dependent Care Flexible Spending Accounts (DCFSA), making it easier for employers to educate employees and reduce paperwork.

## Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: NestJS with TypeORM and PostgreSQL
- **Database**: PostgreSQL with Docker
- **Shared**: Common TypeScript types and interfaces

## Setup Instructions

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- pnpm, npm, or yarn

### Installation

1. **Install dependencies for all packages:**
   ```bash
   pnpm install
   ```

2. **Build the shared package:**
   ```bash
   pnpm run build --workspace=packages/shared
   ```

3. **Start the database:**
   ```bash
   pnpm run db:up
   ```
   This will start PostgreSQL and automatically seed it with demo data.

4. **Start the development servers:**
   ```bash
   pnpm run dev
   ```
   This will start both the backend (http://localhost:3001) and frontend (http://localhost:3000).

### Demo Data

The application comes with pre-seeded demo data for one employee:

- **Employee**: John Doe (Employee ID: EMP001)
- **FSA Account**: DCFSA with $5,000 annual limit
- **Current Balance**: $3,200 remaining ($1,800 used)
- **Sample Transactions**: Several childcare-related expenses

## API Endpoints

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `GET /api/employees/:id/account` - Get employee with FSA account details
- `GET /api/employees/by-employee-id/:employeeId` - Get employee by employee ID

### FSA Accounts
- `GET /api/fsa-accounts` - Get all FSA accounts
- `GET /api/fsa-accounts/:id` - Get FSA account by ID
- `GET /api/fsa-accounts/employee/:employeeId` - Get FSA accounts for employee
- `GET /api/fsa-accounts/employee/:employeeId/active` - Get active FSA account for employee

## Features

### Current Features
- View employee account details
- Display FSA account balance and usage
- Visual balance summary with progress bar
- Responsive design with Tailwind CSS

### Planned Features
- Employee login/authentication
- Submit expense receipts
- Approve/reject transactions
- Generate reports
- Email notifications
- Mobile app

## Development

### Project Structure
```
/
├── frontend/              # Next.js application
├── backend/               # NestJS API server
├── packages/
│   └── shared/            # Common types and interfaces
├── docker-compose.yml     # Database setup
└── package.json          # Monorepo configuration
```

### Adding New Features

1. Update types in `packages/shared/src/types/`
2. Rebuild shared package: `npm run build --workspace=packages/shared`
3. Implement backend logic in NestJS modules
4. Create frontend components and API calls

## Database Schema

### Employees Table
- id (UUID, Primary Key)
- first_name, last_name
- email (unique)
- employee_id (unique)
- department
- hire_date
- created_at, updated_at

### FSA Accounts Table
- id (UUID, Primary Key)
- employee_id (Foreign Key)
- account_type (DCFSA)
- annual_limit (decimal)
- current_balance (decimal)
- used_amount (decimal)
- plan_year_start, plan_year_end
- status (active/inactive/suspended)
- created_at, updated_at

### Transactions Table
- id (UUID, Primary Key)
- fsa_account_id (Foreign Key)
- amount (decimal)
- description
- transaction_date
- transaction_type (debit/credit)
- category
- receipt_url
- status (pending/approved/rejected)
- created_at, updated_at

## License

UNLICENSED - Internal use only