import { Share2, Trash2 } from 'lucide-react';
import { useBusinessCards } from '../store/businessCards';
import { BusinessCard } from '../types';

interface BusinessCardListProps {
  gameId: string;
}

export default function BusinessCardList({ gameId }: BusinessCardListProps) {
  const { getCardsByGame } = useBusinessCards();
  const cards = getCardsByGame(gameId);

  const shareContact = (card: BusinessCard) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${card.name}
ORG:${card.company}
TITLE:${card.title}
TEL:${card.phone}
EMAIL:${card.email}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${card.name}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        まだ名刺がスキャンされていません
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
      {cards.map((card) => (
        <div key={card.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            src={card.imageUrl} 
            alt={`${card.name}'s business card`}
            className="w-full h-32 object-cover"
          />
          <div className="p-4">
            <h3 className="font-bold text-lg">{card.name}</h3>
            <p className="text-gray-600">{card.company}</p>
            <p className="text-gray-500 text-sm">{card.title}</p>
            {card.email && (
              <p className="text-blue-600 text-sm truncate">
                <a href={`mailto:${card.email}`}>{card.email}</a>
              </p>
            )}
            {card.phone && (
              <p className="text-blue-600 text-sm">
                <a href={`tel:${card.phone}`}>{card.phone}</a>
              </p>
            )}
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => shareContact(card)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}