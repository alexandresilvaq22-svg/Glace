
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
  name: string;
  email: string;
  level: EnglishLevel;
  goal: Goal;
  language: AppLanguage;
  profession?: string;
  weeklyFrequency: number;
  notificationsPerDay: number;
  knownCommonWords: string[];
  trialStartDate: string; // ISO String
  isSubscribed: boolean;
}

export interface PracticeCycle {
  id: string;
  userId: string;
  name: string;
  words: string[];
  durationDays: number;
  notificationsPerDay: number;
  daysOfWeek: number[];
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
