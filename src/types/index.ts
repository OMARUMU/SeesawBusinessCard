export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  duration: number;
  effect: 'wider_tolerance' | 'slower_movement' | 'bonus_points';
  multiplier: number;
}

export interface UserPlan {
  type: 'free' | 'premium';
  features: {
    adFree: boolean;
    customThemes: boolean;
    powerUps: boolean;
    maxDailyGames: number;
  };
}

export interface BusinessCard {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  imageUrl: string;
  gameId: string;
  createdAt: string;
}