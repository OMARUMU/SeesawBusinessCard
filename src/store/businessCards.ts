import { create } from 'zustand';
import { BusinessCard } from '../types';

interface BusinessCardStore {
  cards: BusinessCard[];
  addCard: (card: BusinessCard) => void;
  getCardsByGame: (gameId: string) => BusinessCard[];
}

export const useBusinessCards = create<BusinessCardStore>((set, get) => ({
  cards: [],
  addCard: (card) => set((state) => ({ 
    cards: [...state.cards, card] 
  })),
  getCardsByGame: (gameId) => get().cards.filter(card => card.gameId === gameId),
}))