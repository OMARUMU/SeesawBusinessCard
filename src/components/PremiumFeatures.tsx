import { Crown, Palette, Zap } from 'lucide-react';
import { Theme, PowerUp } from '../types';

interface PremiumFeaturesProps {
  onUpgrade: () => void;
  themes: Theme[];
  powerUps: PowerUp[];
  onThemeSelect: (themeId: string) => void;
  onPowerUpActivate: (powerUpId: string) => void;
  isPremium: boolean;
}

export default function PremiumFeatures({
  onUpgrade,
  themes,
  powerUps,
  onThemeSelect,
  onPowerUpActivate,
  isPremium,
}: PremiumFeaturesProps) {
  if (!isPremium) {
    return (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg shadow-lg text-white">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-6 h-6" />
          <h2 className="text-xl font-bold">Upgrade to Premium</h2>
        </div>
        <ul className="space-y-2 mb-6">
          <li className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>Custom Themes</span>
          </li>
          <li className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Power-ups</span>
          </li>
          <li className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            <span>Ad-free Experience</span>
          </li>
        </ul>
        <button
          onClick={onUpgrade}
          className="w-full py-3 px-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
        >
          Upgrade Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-500" />
          Themes
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeSelect(theme.id)}
              className="p-3 rounded-lg text-sm font-medium hover:opacity-80 transition"
              style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Power-ups
        </h3>
        <div className="space-y-3">
          {powerUps.map((powerUp) => (
            <button
              key={powerUp.id}
              onClick={() => onPowerUpActivate(powerUp.id)}
              className="w-full p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-white font-medium hover:opacity-90 transition"
            >
              <div className="font-semibold">{powerUp.name}</div>
              <div className="text-sm opacity-90">{powerUp.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}