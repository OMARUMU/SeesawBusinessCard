import { QrCode, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import QRCodeLib from 'qrcode';

interface QRCodeProps {
  show: boolean;
  onClose: () => void;
  roomId: string | null;
  onJoin: (id: string) => void;
}

export default function QRCode({ show, onClose, roomId, onJoin }: QRCodeProps) {
  const [joinId, setJoinId] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (roomId) {
      const generateQR = async () => {
        try {
          const url = await QRCodeLib.toDataURL(roomId);
          setQrCodeUrl(url);
        } catch (err) {
          console.error('Error generating QR code:', err);
        }
      };
      generateQR();
    }
  }, [roomId]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <div className="text-center mb-4">
          <QrCode className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          {roomId ? (
            <>
              <h2 className="text-xl font-bold text-gray-900">ルームID</h2>
              <p className="text-gray-600 mt-1">
                このQRコードを相手にスキャンしてもらってください
              </p>
              {qrCodeUrl && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow-inner">
                  <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />
                </div>
              )}
              <div className="mt-4 text-2xl font-mono font-bold text-blue-600">
                {roomId}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900">ゲームに参加</h2>
              <p className="text-gray-600 mt-1">
                QRコードをスキャンするか、ルームIDを入力してください
              </p>
              <input
                type="text"
                value={joinId}
                onChange={(e) => setJoinId(e.target.value.toUpperCase())}
                placeholder="ルームID"
                className="mt-4 w-full p-2 text-center text-2xl font-mono border rounded"
                maxLength={6}
              />
              <button
                onClick={() => {
                  if (joinId) {
                    onJoin(joinId);
                    onClose();
                  }
                }}
                className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={!joinId}
              >
                参加する
              </button>
            </>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}