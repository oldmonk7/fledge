# Database Setup Guide

This directory contains database initialization and migration scripts for the Fledge application.

## Choosing a database

### Using Supabase (or any hosted Postgres)

1. Create a project at [supabase.com](https://supabase.com) (or use another Postgres host).
2. In **Project Settings → Database**, copy the **Connection string** (URI). Use "Session mode" or "Transaction mode" (pooler) as you prefer.
3. Replace the placeholder password in the URI with your database password.
4. Set `DATABASE_URL` in your backend environment (e.g. `backend/.env` or `backend/src/.env`) to that URI. Do not commit the real URI.
5. Run the backend; in non-production, TypeORM will create tables via `synchronize`. For production, set `NODE_ENV=production` (synchronize is disabled) and use migrations when you add them.

### Using local Postgres (Docker or system Postgres)

1. Leave `DATABASE_URL` unset.
2. Optionally set `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` (defaults work with the project’s Docker Compose: localhost:5433, user `fledge_user`, database `fledge`).
3. Start Postgres: from repo root run `npm run db:up` to use Docker, or use your system Postgres.
4. If using Docker, run `setup-db.sh` from this directory to create the database and user if they don’t exist.
5. Run the backend.

## Files Overview

- `migrate-employees-to-users.sql` - Migration for existing employee data without users
- `setup-db.sh` - Database and user creation script (local Postgres only)

## User-Employee Relationship

**Important**: Every employee MUST have an associated user. The database schema enforces this constraint.

### Existing Databases with Employee Data

If you have existing employee records without user accounts:

1. Run the migration script first:
   ```bash
   psql -d fledge -f src/database/migrate-employees-to-users.sql
   ```

## Troubleshooting

### "column user_id contains null values" Error

This occurs when employee records exist without associated user accounts:

1. **For existing data**: Run `migrate-employees-to-users.sql` first
2. **Verify**: Check that all employees have user_id values:
   ```sql
   SELECT COUNT(*) as orphaned_employees FROM employees WHERE user_id IS NULL;
   ```

### Database Connection Issues

**Supabase**: Ensure `DATABASE_URL` is set correctly and the password in the URI is the database password from Project Settings → Database. The backend enables SSL automatically when using `DATABASE_URL`.

**Local Postgres**: Ensure PostgreSQL is running and the database exists:
```bash
# Check if database exists
psql -l | grep fledge

# Create database if needed
createdb fledge
```

### Permission Issues

Ensure the database user has proper permissions:
```bash
# Grant permissions
psql -d fledge -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fledge_user;"
psql -d fledge -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fledge_user;"
```
