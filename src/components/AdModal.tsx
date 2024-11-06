import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';

interface AdModalProps {
  show: boolean;
  onComplete: () => void;
  onClose: () => void;
}

export default function AdModal({ show, onComplete, onClose }: AdModalProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (show && progress < 100) {
      const timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(timer);
            return 100;
          }
          return p + 1;
        });
      }, 50);

      return () => clearInterval(timer);
    }
  }, [show, progress]);

  useEffect(() => {
    if (progress === 100) {
      onComplete();
      setProgress(0);
    }
  }, [progress, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="text-center mb-4">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <h2 className="text-xl font-bold text-gray-900">Watching Ad</h2>
          <p className="text-gray-600 mt-1">
            Please wait while the ad plays...
          </p>
        </div>
        
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-blue-600 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}