import { useState, useCallback, useEffect } from 'react';
import { useBusinessCards } from '../store/businessCards';

const INITIAL_TOLERANCE = 10;
const RANK_TOLERANCE_DECREASE = 0.3;
const GAME_DURATION = 60;

export function useGameState() {
  const [rank, setRank] = useState(1);
  const [targetBalance, setTargetBalance] = useState(generateRandomTarget());
  const [isBalanced, setIsBalanced] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isGameActive, setIsGameActive] = useState(false);
  const [showScanner, setShowScanner] = useState(true);
  const { cards } = useBusinessCards();

  function generateRandomTarget() {
    return Math.random() * 10 - 5;
  }

  const getCurrentTolerance = useCallback(() => {
    return Math.max(INITIAL_TOLERANCE - (rank - 1) * RANK_TOLERANCE_DECREASE, 3);
  }, [rank]);

  const checkBalance = useCallback((currentAngle: number) => {
    if (!isGameActive) return;
    const tolerance = getCurrentTolerance();
    const balanced = Math.abs(currentAngle - targetBalance) <= tolerance;
    if (balanced && !isBalanced) {
      setIsBalanced(true);
      setTimeout(() => {
        setTargetBalance(generateRandomTarget());
        setIsBalanced(false);
      }, 1000);
    }
  }, [targetBalance, getCurrentTolerance, isGameActive, isBalanced]);

  const increaseRank = useCallback(() => {
    setRank(r => r + 1);
    setTargetBalance(generateRandomTarget());
  }, []);

  const generateNewTarget = useCallback(() => {
    setTargetBalance(generateRandomTarget());
    setIsBalanced(false);
  }, []);

  const createRoom = useCallback(() => {
    if (cards.length === 0) {
      setShowScanner(true);
      return;
    }
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(newRoomId);
    setIsGameActive(true);
    setTimeLeft(GAME_DURATION);
  }, [cards.length]);

  const joinRoom = useCallback((id: string) => {
    if (cards.length === 0) {
      setShowScanner(true);
      return;
    }
    setRoomId(id);
    setIsGameActive(true);
    setTimeLeft(GAME_DURATION);
  }, [cards.length]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setIsGameActive(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameActive, timeLeft]);

  return {
    rank,
    targetBalance,
    isBalanced,
    roomId,
    timeLeft,
    isGameActive,
    showScanner,
    setShowScanner,
    increaseRank,
    checkBalance,
    generateNewTarget,
    createRoom,
    joinRoom,
  };
}