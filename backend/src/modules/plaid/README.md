# Plaid Integration

This module provides Plaid integration for connecting bank accounts and fetching transactions.

## Setup

1. **Get Plaid Credentials**
   - Sign up for a Plaid account at https://plaid.com
   - Navigate to the Dashboard and get your API keys
   - For testing, use the Sandbox environment credentials

2. **Environment Variables**
   Add the following environment variables to your `.env` file:
   ```
   PLAID_CLIENT_ID=your_client_id
   PLAID_SECRET=your_secret_key
   ```

   Note: The service is configured to use Plaid's Sandbox environment for testing.

## Features

- **Link Token Creation**: Creates a link token for Plaid Link initialization
- **Token Exchange**: Exchanges public tokens for access tokens
- **Transaction Fetching**: Retrieves transactions from connected bank accounts
- **Item Management**: Manages Plaid items (connected bank accounts)

## API Endpoints

- `POST /api/plaid/link-token/:userId` - Create a link token
- `POST /api/plaid/exchange-token/:userId` - Exchange public token for access token
- `GET /api/plaid/transactions/:userId` - Get transactions (optional query params: `start_date`, `end_date`)
- `GET /api/plaid/items/:userId` - Get all Plaid items for a user
- `DELETE /api/plaid/items/:userId/:itemId` - Remove a Plaid item

## Testing with Plaid Sandbox

When using Plaid's Sandbox environment, you can use test credentials:
- Username: `user_good`
- Password: `pass_good`
- Institution: Select any test institution (e.g., "First Platypus Bank")

For more test credentials and scenarios, see: https://plaid.com/docs/sandbox/test-credentials/
