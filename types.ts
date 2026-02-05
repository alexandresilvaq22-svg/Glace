
export enum EnglishLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export enum Goal {
  TRAVEL = 'Travel',
  WORK = 'Work',
  STUDIES = 'Studies',
  CONVERSATION = 'Conversation'
}

export type AppLanguage = 'pt' | 'en';

export interface UserProfile {
  id: string;
  email: string;
  level: EnglishLevel;
  goal: Goal;
  language: AppLanguage;
  profession?: string;
  weeklyFrequency: number;
  knownCommonWords: string[];
}

export interface PracticeCycle {
  id: string;
  userId: string;
  name: string;
  words: string[];
  durationDays: number;
  notificationsPerDay: number;
  daysOfWeek: number[]; // 0-6 (Sunday to Saturday)
  status: 'active' | 'completed' | 'paused';
  startDate: string;
}

export interface NotificationContent {
  id: string;
  cycleId: string;
  dayNumber: number;
  title: string;
  body: string;
  timestamp: string;
  type: 'word' | 'sentence' | 'text';
}

export type AppState = 'welcome' | 'onboarding' | 'dashboard' | 'create-cycle' | 'settings' | 'history';
