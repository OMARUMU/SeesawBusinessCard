import { motion } from 'framer-motion';
import { Theme } from '../types';

interface SeesawProps {
  tiltAngle: number;
  targetBalance: number;
  isBalanced: boolean;
  theme: Theme | null;
}

export default function Seesaw({ tiltAngle, targetBalance, isBalanced, theme }: SeesawProps) {
  return (
    <div className="relative h-64 w-full">
      <motion.div
        className="absolute left-1/2 top-1/2 w-4/5 h-4 rounded-full origin-center -translate-x-1/2 -translate-y-1/2"
        style={{ 
          backgroundColor: theme?.colors.primary ?? '#2563eb',
        }}
        animate={{ rotate: tiltAngle }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div 
          className="absolute -left-4 top-1/2 w-8 h-8 rounded-full -translate-y-1/2"
          style={{ backgroundColor: theme?.colors.secondary ?? '#1d4ed8' }}
        />
        <div 
          className="absolute -right-4 top-1/2 w-8 h-8 rounded-full -translate-y-1/2"
          style={{ backgroundColor: theme?.colors.secondary ?? '#1d4ed8' }}
        />
      </motion.div>
      
      <div 
        className="absolute left-1/2 bottom-0 w-16 h-32 -translate-x-1/2 rounded-t-lg"
        style={{ backgroundColor: theme?.colors.accent ?? '#1e40af' }}
      />
      
      {isBalanced && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-green-500 text-white px-4 py-2 rounded-full"
        >
          Balanced!
        </motion.div>
      )}
    </div>
  );
}