# 💸 AskCents: Your Smart Money Sidekick

Welcome to AskCents — the fun, friendly, and powerful financial wellness app designed for students and young adults who want to level up their money game! 🚀

Imagine having a personal finance coach, a rewards center, and a super-smart AI chatbot all in your pocket. AskCents makes managing your money easy, engaging, and even a little bit addictive.

## Why You'll Love AskCents

- 🤖 **Chat with Gemini AI:** Get instant answers, personalized tips, and financial wisdom from Google’s Generative AI. It’s like texting your money-savvy best friend!
- 🏦 **Connect Your Bank (Securely!):** Link your real accounts with Plaid and see your actual balances, transactions, and spending trends — all protected by top-tier security.
- 🎯 **Earn Points & Unlock Rewards:** Complete fun financial tasks, earn points, and redeem exclusive offers. Saving money has never felt so good!
- 📊 **See Your Spending Breakdown:** Colorful charts and insights show exactly where your money goes. Every dollar (and cent!) is tracked to two decimal places for total clarity.
- 🏆 **Set Goals & Track Progress:** Dream big, set savings goals, and watch your financial health improve with every step.
- ⚡ **Quick Actions & Suggestions:** Get smart follow-ups and one-tap replies to keep your financial journey moving fast.
- 🛡️ **Privacy First:** No sensitive logs, no database — your data stays with you. Session-based memory means your info is private and resets when you want.
- 🌙 **Beautiful, Modern UI:** Enjoy a sleek, mobile-friendly design that makes money management feel effortless and fun.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google AI API key
- Plaid API credentials

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

3. **Start the app:**
   ```bash
   # Start both frontend and backend
   npm run dev:full

   # Or start them separately:
   npm run backend    # Backend server on port 3001
   npm run dev        # Frontend on port 5173
   ```

4. **Open your browser** to [http://localhost:5173](http://localhost:5173) and start your financial adventure!


## ✨ Features That Make AskCents Shine

- 🤖 **Gemini AI Chatbot:** Ask anything, get instant answers, and enjoy personalized financial coaching.
- 🏦 **Bank Integration:** See your real balances and transactions, securely and privately.
- 🎯 **Points & Rewards:** Complete challenges, earn points, and unlock cool offers.
- 📊 **Spending Breakdown:** Track every dollar and cent with beautiful charts and two-decimal precision.
- 🏆 **Goals & Progress:** Set savings goals and celebrate your wins.
- ⚡ **Quick Actions:** One-tap replies and smart suggestions keep you moving forward.
- 🛡️ **Privacy & Security:** No sensitive logs, no database, just you and your money.
- 🌙 **Modern, Fun UI:** Enjoy a delightful, mobile-first experience that makes finance feel fresh.

## 🛠️ Tech Stack

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

## 🚀 Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run lint` — Run ESLint

## 💡 Usage Notes

- **API Key:** Pop your own Google Generative AI API key into the `.env` file to unlock the chatbot magic.
- **Session Memory:** Your chat history is saved in your browser session and resets when you close the tab or clear the chat.
- **No Backend/Database:** All data is local to your session for privacy and simplicity.

---

Made with ❤️ by students and young adults, for students and young adults. Take control of your financial future, have fun, and let AskCents be your money sidekick!
