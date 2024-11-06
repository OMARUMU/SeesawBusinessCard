import { X } from 'lucide-react';

interface GameInstructionsProps {
  show: boolean;
  onClose: () => void;
}

export default function GameInstructions({ show, onClose }: GameInstructionsProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">遊び方</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="font-semibold text-lg mb-2">1. アプリの起動と接続</h3>
            <p className="text-gray-600">
              2人ともスマートフォンでアプリを開き、片方が「ゲームを作成」、もう片方が「ゲームに参加」を選んでください。
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">2. ゲームのルール</h3>
            <p className="text-gray-600">
              2人で協力してシーソーのバランスを取ります。スマートフォンを傾けることでシーソーが動きます。
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">3. プレイ方法</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>スマホを前に傾けると、シーソーの手前が下がります</li>
              <li>スマホを後ろに傾けると、シーソーの奥が下がります</li>
              <li>相手と協力して、シーソーのバランスを保ちましょう！</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-lg mb-2">4. プレミアム機能</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>広告非表示でプレイ可能</li>
              <li>カスタムテーマでゲーム画面をカスタマイズ</li>
              <li>パワーアップアイテムでゲームを有利に進行</li>
            </ul>
          </section>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}