import { useState, useRef, useCallback } from 'react';
import { Camera, X, Save } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { motion, AnimatePresence } from 'framer-motion';
import { useBusinessCards } from '../store/businessCards';
import { BusinessCard } from '../types';

interface BusinessCardScannerProps {
  onScanComplete?: () => void;
  gameId?: string;
}

export default function BusinessCardScanner({ onScanComplete, gameId }: BusinessCardScannerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addCard } = useBusinessCards();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
  };

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        return canvasRef.current.toDataURL('image/jpeg', 0.8);
      }
    }
    return null;
  }, []);

  const extractBusinessCardInfo = (text: string) => {
    const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(?:\+\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,4}/;
    
    let email = '';
    let phone = '';
    let name = '';
    let company = '';
    let title = '';

    for (const line of lines) {
      if (!email && emailRegex.test(line)) {
        email = line.match(emailRegex)![0];
        continue;
      }
      if (!phone && phoneRegex.test(line)) {
        phone = line.match(phoneRegex)![0];
        continue;
      }
      if (!name && line.length > 0 && line.length < 30) {
        name = line;
        continue;
      }
      if (!title && line.includes('部') || line.includes('長') || line.includes('役')) {
        title = line;
        continue;
      }
      if (!company && line.includes('株式会社') || line.includes('有限会社')) {
        company = line;
      }
    }

    return { name, company, title, email, phone };
  };

  const scanBusinessCard = async () => {
    setScanning(true);
    const imageData = captureImage();
    if (!imageData) return;

    try {
      const worker = await createWorker();
      await worker.loadLanguage('jpn+eng');
      await worker.initialize('jpn+eng');
      const { data: { text } } = await worker.recognize(imageData);
      await worker.terminate();

      const cardInfo = extractBusinessCardInfo(text);
      const newCard: BusinessCard = {
        id: Math.random().toString(36).substring(2),
        ...cardInfo,
        imageUrl: imageData,
        gameId: gameId || '',
        createdAt: new Date().toISOString(),
      };

      addCard(newCard);
      setIsOpen(false);
      stopCamera();
      onScanComplete?.();
    } catch (err) {
      console.error('Error scanning card:', err);
    } finally {
      setScanning(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black flex flex-col z-50"
        >
          <div className="p-4 flex justify-between items-center bg-gray-900">
            <h2 className="text-white text-lg font-semibold">名刺をスキャン</h2>
            <button
              onClick={() => {
                setIsOpen(false);
                stopCamera();
              }}
              className="p-2 text-white hover:bg-gray-800 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative flex-1">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              onPlay={() => startCamera()}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <canvas ref={canvasRef} className="hidden" width="1920" height="1080" />
            
            <div className="absolute inset-0 border-2 border-white opacity-50 m-8 rounded-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white text-center bg-black/50 p-4 rounded">
                  名刺を枠内に合わせてください
                </p>
              </div>
            </div>
            
            <button
              onClick={scanBusinessCard}
              disabled={scanning}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg disabled:bg-gray-500"
            >
              {scanning ? 'スキャン中...' : '撮影'}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}