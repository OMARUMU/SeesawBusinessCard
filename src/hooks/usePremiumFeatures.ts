import { useState, useCallback } from 'react';
import { Theme, PowerUp, UserPlan } from '../types';

const PREMIUM_THEMES: Theme[] = [
  {
    id: 'neon',
    name: 'Neon Night',
    colors: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      accent: '#ff00aa',
      background: '#000033',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset Vibes',
    colors: {
      primary: '#ff8c00',
      secondary: '#ff5733',
      accent: '#c70039',
      background: '#ffd700',
    },
  },
];

const POWER_UPS: PowerUp[] = [
  {
    id: 'steady-hand',
    name: 'Steady Hand',
    description: 'Makes the seesaw movement more stable',
    duration: 30,
    effect: 'slower_movement',
    multiplier: 0.5,
  },
  {
    id: 'wide-balance',
    name: 'Wide Balance',
    description: 'Increases balance tolerance temporarily',
    duration: 20,
    effect: 'wider_tolerance',
    multiplier: 1.5,
  },
];

export function usePremiumFeatures() {
  const [userPlan, setUserPlan] = useState<UserPlan>({
    type: 'free',
    features: {
      adFree: false,
      customThemes: false,
      powerUps: false,
      maxDailyGames: 10,
    },
  });

  const [activePowerUp, setActivePowerUp] = useState<PowerUp | null>(null);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);

  const upgradeToPremium = useCallback(() => {
    setUserPlan({
      type: 'premium',
      features: {
        adFree: true,
        customThemes: true,
        powerUps: true,
        maxDailyGames: Infinity,
      },
    });
  }, []);

  const activatePowerUp = useCallback((powerUpId: string) => {
    if (!userPlan.features.powerUps) return;
    
    const powerUp = POWER_UPS.find(p => p.id === powerUpId);
    if (powerUp) {
      setActivePowerUp(powerUp);
      setTimeout(() => setActivePowerUp(null), powerUp.duration * 1000);
    }
  }, [userPlan.features.powerUps]);

  const applyTheme = useCallback((themeId: string) => {
    if (!userPlan.features.customThemes) return;
    
    const theme = PREMIUM_THEMES.find(t => t.id === themeId);
    if (theme) {
      setActiveTheme(theme);
    }
  }, [userPlan.features.customThemes]);

  return {
    userPlan,
    themes: PREMIUM_THEMES,
    powerUps: POWER_UPS,
    activePowerUp,
    activeTheme,
    upgradeToPremium,
    activatePowerUp,
    applyTheme,
  };
}