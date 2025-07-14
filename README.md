# 🧠 Brain Break Hub

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
</div>

<div align="center">
  <h3>🎯 Take productive breaks with brain-training games, focus timers, and habit tracking</h3>
  <p>A modern web application designed to help you maintain focus and productivity through structured breaks and cognitive exercises.</p>
</div>

## ✨ Features

### 🎮 Brain Training Games
- **Memory Challenge** - Test and improve your memory with pattern recognition
- **Number Guessing** - Enhance logical thinking with number puzzles
- **Reaction Time** - Measure and improve your reflexes
- **Sudoku** - Classic puzzle game for logical reasoning
- **Tic-Tac-Toe** - Strategic thinking game
- **Trivia Quiz** - Knowledge-based questions across various topics
- **Word Puzzle** - Vocabulary and word association challenges

### ⏱️ Focus Timer (Pomodoro Technique)
- Customizable work and break intervals
- Visual and audio notifications
- Session tracking and statistics
- Progress visualization

### 📊 Habit Tracking
- Create and monitor daily habits
- Streak tracking and progress visualization
- Customizable habit goals and frequencies
- Visual progress indicators

### 🏆 Gamification
- Real-time leaderboard system
- Coin rewards for completed activities
- Achievement tracking
- User rankings and statistics

### 👤 User Management
- Secure authentication with Supabase
- User profiles and preferences
- Progress tracking across all features
- Responsive design for all devices

## 🚀 Live Demo

🌐 **[Visit Brain Break Hub](https://brain-break-hub.netlify.app)**

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Supabase (Database, Authentication, Real-time)
- **Deployment**: Netlify
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📱 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Landing+Page" alt="Landing Page" width="400" />
  <img src="https://via.placeholder.com/800x400/059669/FFFFFF?text=Dashboard" alt="Dashboard" width="400" />
</div>

<div align="center">
  <img src="https://via.placeholder.com/800x400/DC2626/FFFFFF?text=Games" alt="Games" width="400" />
  <img src="https://via.placeholder.com/800x400/7C3AED/FFFFFF?text=Focus+Timer" alt="Focus Timer" width="400" />
</div>

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RajNakti/brain-break-hub.git
   cd brain-break-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Database Schema

The application uses Supabase with the following main tables:
- `profiles` - User profiles and settings
- `game_scores` - Game performance tracking
- `focus_sessions` - Pomodoro timer sessions
- `habits` - User habit definitions
- `habit_entries` - Daily habit completions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Raj Nakti**
- Portfolio: [raj-nakti-portfolio.netlify.app](http://raj-nakti-portfolio.netlify.app)
- GitHub: [@RajNakti](https://github.com/RajNakti)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icons
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

---

<div align="center">
  <p>Made with ❤️ by <a href="http://raj-nakti-portfolio.netlify.app">Raj Nakti</a></p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>
