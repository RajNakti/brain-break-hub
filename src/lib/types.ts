export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  coins: number
  created_at: string
  updated_at: string
}

export interface GameScore {
  id: string
  user_id: string
  game_type: 'memory' | 'reaction' | 'word-puzzle' | 'sudoku' | 'trivia'
  score: number
  difficulty: 'easy' | 'medium' | 'hard'
  duration: number
  created_at: string
}

export interface Habit {
  id: string
  user_id: string
  title: string
  description?: string
  streak: number
  last_completed?: string
  created_at: string
  updated_at: string
}

export interface FocusSession {
  id: string
  user_id: string
  task_name: string
  duration: number
  completed: boolean
  created_at: string
}

export interface BreakActivity {
  id: string
  title: string
  description: string
  duration: number
  type: 'breathing' | 'stretch' | 'meditation'
  instructions: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  coins_reward: number
  requirement: {
    type: 'games_played' | 'focus_sessions' | 'streak' | 'score'
    value: number
    game_type?: string
  }
}

export interface LeaderboardEntry {
  user_id: string
  full_name: string
  avatar_url?: string
  total_score: number
  games_played: number
  rank: number
}

export interface DashboardStats {
  today_focus_time: number
  today_break_time: number
  coins_earned_today: number
  current_streak: number
  games_played_today: number
  total_coins: number
}
