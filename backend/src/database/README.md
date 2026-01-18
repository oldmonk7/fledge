# Database Setup Guide

This directory contains database initialization and migration scripts for the Fledge application.

## Files Overview

- `migrate-employees-to-users.sql` - Migration for existing employee data without users
- `setup-db.sh` - Database and user creation script

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

Ensure PostgreSQL is running and the database exists:
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
