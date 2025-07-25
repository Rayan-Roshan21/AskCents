
# AskCents

AskCents is a modern financial wellness web app for students and young adults. It features a conversational AI chatbot powered by Google Generative AI (Gemini), real bank account integration via Plaid API, session-based memory, and a beautiful, mobile-friendly UI built with React and Vite.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google AI API key
- Plaid API credentials (for bank integration)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

2. **Set up environment variables:**
   
   **Frontend (.env):**
   ```env
   VITE_GOOGLE_AI_API_KEY=your-google-api-key-here
   VITE_PLAID_CLIENT_ID=your-plaid-client-id
   VITE_PLAID_SECRET=your-plaid-secret
   VITE_PLAID_ENV=sandbox
   VITE_API_BASE_URL=http://localhost:3001/api
   ```
   
   **Backend (backend/.env):**
   ```env
   PLAID_CLIENT_ID=your-plaid-client-id
   PLAID_SECRET=your-plaid-secret
   PLAID_ENV=sandbox
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

3. **Start the application:**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start them separately:
   npm run backend    # Backend server on port 3001
   npm run dev        # Frontend on port 5173
   ```

4. **Open your browser** to `http://localhost:5173`


## Features

- **Conversational AI Chatbot**: Powered by Google Gemini (Generative AI), tailored for Canadian and American students/young adults
- **Real Bank Integration**: Secure bank account linking via Plaid API with real account data and transactions
- **Session-Based Memory**: Remembers your chat context during your session (no database required)
- **Modern UI**: Clean, mobile-first design with onboarding, chat, insights, goals, offers, and settings flows
- **Quick Actions & Suggestions**: Get follow-up questions and quick replies for a smooth experience
- **Identity & Account Data**: Access real user identity and account information through Plaid
- **Secure Backend**: Node.js server handles all sensitive Plaid API calls


## Tech Stack

**Frontend:**
- React
- Vite
- JavaScript (ES6+)
- Framer Motion (animations)
- Lucide React (icons)
- Google Generative AI (Gemini)

**Backend:**
- Node.js
- Express.js
- Plaid API
- CORS & Security middleware

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Usage Notes

- **API Key**: You must provide your own Google Generative AI API key in the `.env` file for the chatbot to work.
- **Session Memory**: Chat history is saved in your browser session and resets when you close the tab or clear the chat.
- **No Backend/Database**: All data is local to your session for privacy and simplicity.

---

Made with ❤️ for students and young adults to take control of their financial future.
