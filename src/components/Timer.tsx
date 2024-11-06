import { useEffect, useState } from 'react';

interface TimerProps {
  timeLeft: number;
}

export default function Timer({ timeLeft }: TimerProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 text-center">
      <div className="text-2xl font-bold text-gray-800">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="text-sm text-gray-600">残り時間</div>
    </div>
  );
}