#!/bin/bash
# Database setup script for local PostgreSQL instances
# This creates the user and database if they don't exist

set -e

DB_NAME="fledge"
DB_USER="fledge_user"
DB_PASSWORD="fledge_password"

echo "Setting up PostgreSQL database..."

# Find psql command
if command -v psql &> /dev/null; then
    PSQL_CMD="psql"
elif [ -f "/opt/homebrew/Cellar/postgresql@15/15.13/bin/psql" ]; then
    PSQL_CMD="/opt/homebrew/Cellar/postgresql@15/15.13/bin/psql"
elif [ -f "/usr/local/bin/psql" ]; then
    PSQL_CMD="/usr/local/bin/psql"
else
    PSQL_CMD=$(find /usr/local /opt /Applications -name psql 2>/dev/null | head -1)
    if [ -z "$PSQL_CMD" ]; then
        echo "Error: psql command not found. Please install PostgreSQL client tools."
        exit 1
    fi
fi

echo "Using psql at: $PSQL_CMD"

# Create user if it doesn't exist
echo "Creating user $DB_USER if it doesn't exist..."
$PSQL_CMD -U postgres -h localhost -tc "SELECT 1 FROM pg_roles WHERE rolname = '$DB_USER'" | grep -q 1 || \
$PSQL_CMD -U postgres -h localhost -c "CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD';"

# Create database if it doesn't exist
echo "Creating database $DB_NAME if it doesn't exist..."
$PSQL_CMD -U postgres -h localhost -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
$PSQL_CMD -U postgres -h localhost -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

# Grant privileges
echo "Granting privileges..."
$PSQL_CMD -U postgres -h localhost -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
$PSQL_CMD -U postgres -h localhost -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
$PSQL_CMD -U postgres -h localhost -d $DB_NAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;"
$PSQL_CMD -U postgres -h localhost -d $DB_NAME -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;"

echo "Database setup complete!"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo ""
echo "You can now run the application."

