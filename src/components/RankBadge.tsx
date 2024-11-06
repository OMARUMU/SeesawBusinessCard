import { Trophy } from 'lucide-react';

interface RankBadgeProps {
  rank: number;
}

export default function RankBadge({ rank }: RankBadgeProps) {
  return (
    <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-md">
      <Trophy className="w-4 h-4 text-yellow-500" />
      <span className="font-semibold text-gray-700">Rank {rank}</span>
    </div>
  );
}