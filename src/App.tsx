import { useState, useEffect } from 'react';
import { Compass, Trophy, QrCode, Share2, Crown, Users, Clock } from 'lucide-react';
import QRCode from './components/QRCode';
import Seesaw from './components/Seesaw';
import RankBadge from './components/RankBadge';
import AdModal from './components/AdModal';
import PremiumFeatures from './components/PremiumFeatures';
import GameInstructions from './components/GameInstructions';
import BusinessCardScanner from './components/BusinessCardScanner';
import { useDeviceOrientation } from './hooks/useDeviceOrientation';
import { useGameState } from './hooks/useGameState';
import { usePremiumFeatures } from './hooks/usePremiumFeatures';

function App() {
  const [showQR, setShowQR] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { beta: tiltAngle, permissionGranted } = useDeviceOrientation();
  const { 
    rank,
    targetBalance,
    increaseRank,
    checkBalance,
    generateNewTarget,
    isBalanced,
    roomId,
    timeLeft,
    isGameActive,
    createRoom,
    joinRoom
  } = useGameState();
  
  const {
    userPlan,
    themes,
    powerUps,
    activePowerUp,
    activeTheme,
    upgradeToPremium,
    activatePowerUp,
    applyTheme,
  } = usePremiumFeatures();

  useEffect(() => {
    if (tiltAngle !== null && permissionGranted) {
      const adjustedAngle = activePowerUp?.effect === 'slower_movement'
        ? tiltAngle * activePowerUp.multiplier
        : tiltAngle;
      checkBalance(adjustedAngle);
    }
  }, [tiltAngle, checkBalance, activePowerUp, permissionGranted]);

  const handleAdComplete = () => {
    setShowAd(false);
    increaseRank();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="min-h-screen transition-colors duration-300"
      style={{
        background: activeTheme 
          ? `linear-gradient(to bottom, ${activeTheme.colors.background}, ${activeTheme.colors.secondary})`
          : 'linear-gradient(to bottom, #f0f9ff, #e0f2fe)'
      }}
    >
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Compass className="w-6 h-6" style={{ color: activeTheme?.colors.primary }} />
          <h1 className="text-xl font-bold" style={{ color: activeTheme?.colors.primary }}>
            シーソーバランス
          </h1>
        </div>
        <div className="flex gap-4">
          <RankBadge rank={rank} />
          {isGameActive && (
            <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-md">
              <Clock className="w-4 h-4 text-red-500" />
              <span className="font-semibold text-gray-700">{formatTime(timeLeft)}</span>
            </div>
          )}
          <button 
            onClick={() => setShowInstructions(true)}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
          >
            <Users className="w-5 h-5 text-blue-500" />
          </button>
          <button 
            onClick={() => setShowQR(true)}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
          >
            <QrCode className="w-5 h-5" style={{ color: activeTheme?.colors.primary }} />
          </button>
          <button
            onClick={() => setShowPremium(true)}
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
          >
            <Crown className="w-5 h-5 text-yellow-500" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {!permissionGranted ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-bold mb-4">センサーの許可が必要です</h2>
              <p className="text-gray-600 mb-4">
                このゲームをプレイするには、デバイスの傾きセンサーへのアクセスを許可してください。
              </p>
              <button
                onClick={() => {
                  if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                    (DeviceOrientationEvent as any).requestPermission();
                  }
                }}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                センサーを許可する
              </button>
            </div>
          ) : !roomId ? (
            <div className="space-y-4 mb-8">
              <button
                onClick={createRoom}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
              >
                ゲームを作成
              </button>
              <button
                onClick={() => setShowQR(true)}
                className="w-full py-3 px-4 bg-white text-blue-600 rounded-lg shadow-md hover:bg-gray-50 transition"
              >
                ゲームに参加
              </button>
            </div>
          ) : (
            <>
              <Seesaw 
                tiltAngle={tiltAngle ?? 0} 
                targetBalance={targetBalance}
                isBalanced={isBalanced}
                theme={activeTheme}
              />
              
              {activePowerUp && (
                <div className="mt-4 bg-yellow-100 border border-yellow-200 p-4 rounded-lg">
                  <div className="font-semibold text-yellow-800">
                    {activePowerUp.name}が有効です！
                  </div>
                  <div className="text-sm text-yellow-600">
                    効果: {activePowerUp.description}
                  </div>
                </div>
              )}
              
              <div className="mt-8 space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-lg font-semibold mb-2 text-gray-800">
                    現在の傾き: {tiltAngle?.toFixed(2)}°
                  </h2>
                  <p className="text-gray-600">
                    目標の傾き: {targetBalance.toFixed(2)}°
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    許容範囲: ±{Math.max(10 - (rank - 1) * 0.3, 3).toFixed(1)}°
                  </p>
                </div>

                {!userPlan.features.adFree && (
                  <button
                    onClick={() => setShowAd(true)}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-5 h-5" />
                    広告を見てランクアップ
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <BusinessCardScanner />
      <QRCode show={showQR} onClose={() => setShowQR(false)} roomId={roomId} onJoin={joinRoom} />
      <AdModal show={showAd} onComplete={handleAdComplete} onClose={() => setShowAd(false)} />
      <GameInstructions show={showInstructions} onClose={() => setShowInstructions(false)} />
      
      {showPremium && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-50 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <PremiumFeatures
              onUpgrade={upgradeToPremium}
              themes={themes}
              powerUps={powerUps}
              onThemeSelect={applyTheme}
              onPowerUpActivate={activatePowerUp}
              isPremium={userPlan.type === 'premium'}
            />
            <button
              onClick={() => setShowPremium(false)}
              className="mt-6 w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;