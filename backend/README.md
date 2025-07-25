# AskCents Backend

This is the Node.js backend server for AskCents that handles secure Plaid API integration.

## Features

- **Plaid Integration**: Secure bank account linking via Plaid API
- **Link Token Creation**: Generates link tokens for Plaid Link initialization
- **Access Token Exchange**: Exchanges public tokens for access tokens
- **Account Information**: Retrieves user account data
- **Identity Data**: Gets user identity information
- **Transaction History**: Fetches user transactions
- **CORS Support**: Configured for frontend communication

## Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy the `.env` file and update with your Plaid credentials:
   ```
   PLAID_CLIENT_ID=your_plaid_client_id
   PLAID_SECRET=your_plaid_secret
   PLAID_ENV=sandbox
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start the Server**:
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

## API Endpoints

### Health Check
- `GET /api/health` - Server health check

### Plaid Integration
- `POST /api/create_link_token` - Create a link token for Plaid Link
- `POST /api/set_access_token` - Exchange public token for access token
- `POST /api/accounts` - Get user account information
- `POST /api/identity` - Get user identity data
- `POST /api/transactions` - Get user transaction history
- `POST /api/item/remove` - Remove/disconnect bank account

## Development

The server runs on `http://localhost:3001` by default and is configured to accept requests from the frontend at `http://localhost:5173`.

## Security

- All Plaid API calls are made server-side
- Access tokens are stored temporarily in memory (use database in production)
- CORS is configured to only allow requests from the frontend
- Environment variables keep sensitive credentials secure
