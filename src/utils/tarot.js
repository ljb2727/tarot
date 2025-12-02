import tarotData from '../data/card.json';

export const getDeck = () => {
  const baseUrl = import.meta.env.BASE_URL;
  
  const major = tarotData.tarot_deck_data.major_arcana.map(card => {
    const numberStr = card.number.toString().padStart(2, '0');
    const nameStr = card.name_en.replace(/\s+/g, '');
    return {
      ...card,
      id: `major_${card.number}`,
      type: 'major',
      image: `${baseUrl}cards/${numberStr}-${nameStr}.png`
    };
  });

  const suits = ['wands', 'cups', 'swords', 'pentacles'];
  let minor = [];

  const getMinorNumber = (number) => {
    if (typeof number === 'number') return number.toString().padStart(2, '0');
    switch (number) {
      case 'Ace': return '01';
      case 'Page': return '11';
      case 'Knight': return '12';
      case 'Queen': return '13';
      case 'King': return '14';
      default: return '00';
    }
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  suits.forEach(suit => {
    const suitCards = tarotData.tarot_deck_data.minor_arcana[suit].map(card => ({
      ...card,
      id: `${suit}_${card.number}`,
      type: 'minor',
      suit: suit,
      image: `${baseUrl}cards/${capitalize(suit)}${getMinorNumber(card.number)}.png`
    }));
    minor = [...minor, ...suitCards];
  });

  return [...major, ...minor];
};

export const shuffleDeck = (deck) => {
  // 1. 먼저 카드를 섞습니다.
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }

  // 2. 각 카드에 대해 35% 확률로 역방향 설정 (30~40% 사이)
  return newDeck.map(card => ({
    ...card,
    isReversed: Math.random() < 0.35
  }));
};
