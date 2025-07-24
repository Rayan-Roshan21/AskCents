
# AskCents

AskCents is a modern financial wellness web app for students and young adults. It features a conversational AI chatbot powered by Google Generative AI (Gemini), session-based memory, and a beautiful, mobile-friendly UI built with React and Vite.


## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your Google Generative AI API key:**
   - Sign up at [Google AI Studio](https://makersuite.google.com/app/apikey) and get your API key.
   - Create a `.env` file in the project root:
     ```env
     VITE_GOOGLE_AI_API_KEY=your-google-api-key-here
     ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```


## Features

- **Conversational AI Chatbot**: Powered by Google Gemini (Generative AI), tailored for Canadian and American students/young adults
- **Session-Based Memory**: Remembers your chat context during your session (no database required)
- **Modern UI**: Clean, mobile-first design with onboarding, chat, insights, goals, offers, and settings flows
- **Quick Actions & Suggestions**: Get follow-up questions and quick replies for a smooth experience
- **No Account Required**: All data is stored in your browser session for privacy


## Tech Stack

- React
- Vite
- JavaScript (ES6+)
- Framer Motion (animations)
- Lucide React (icons)
- Google Generative AI (Gemini)

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
