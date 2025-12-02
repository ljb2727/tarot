import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDeck, shuffleDeck } from '../utils/tarot';
import Card from '../components/Card';
import '../styles/Reading.css';

const Reading = () => {
  const [deck, setDeck] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { question } = location.state || { question: '' };

  useEffect(() => {
    if (!question) {
      navigate('/');
    }
    const initialDeck = getDeck();
    const shuffled = shuffleDeck(initialDeck);
    setDeck(shuffled);
  }, [question, navigate]);

  const handleCardClick = (card) => {
    if (selectedCards.length < 3 && !selectedCards.includes(card)) {
      const newSelected = [...selectedCards, card];
      setSelectedCards(newSelected);
      
      if (newSelected.length === 3) {
        setTimeout(() => {
          navigate('/result', { state: { cards: newSelected, question } });
        }, 1000);
      }
    }
  };

  return (
    <div className="container reading-container">
      <div className="question-display">
        <span className="question-label">Q.</span>
        <span className="question-text">{question}</span>
      </div>
      <h2>카드를 3장 선택해주세요</h2>
      <p className="instruction">
        {selectedCards.length === 0 && "첫 번째 카드는 '과거'를 의미합니다."}
        {selectedCards.length === 1 && "두 번째 카드는 '현재'를 의미합니다."}
        {selectedCards.length === 2 && "세 번째 카드는 '미래'를 의미합니다."}
        {selectedCards.length === 3 && "운명을 확인하는 중..."}
      </p>
      
      {selectedCards.length > 0 && (
        <div className="selected-preview">
          {selectedCards.map((card, idx) => (
            <div key={card.id} className="preview-card">
              <img 
                src={card.image} 
                alt={card.name_kr}
                style={{ transform: card.isReversed ? 'rotate(180deg)' : 'none' }}
                onError={(e) => { e.target.src = '/cards/card_back.png'; }}
              />
              <p>
                {['과거', '현재', '미래'][idx]}
                {card.isReversed && <span style={{ color: '#ff6b6b', fontSize: '0.8em' }}> (역방향)</span>}
              </p>
            </div>
          ))}
        </div>
      )}
      
      <div className="card-spread">
        {deck.map((card, index) => (
          <motion.div
            key={card.id}
            className={`spread-card-wrapper ${selectedCards.includes(card) ? 'selected' : ''}`}
            initial={{ x: 0, y: 0, rotate: 0 }}
            animate={{ 
              x: (index - 39) * 15,
              y: Math.abs(index - 39) * 2,
              rotate: (index - 39) * 2 
            }}
            transition={{ duration: 1, delay: index * 0.01 }}
            style={{ 
              zIndex: index,
              position: 'absolute',
              left: '50%',
              top: '20%',
              marginLeft: '-100px'
            }}
          >
            <Card 
              card={card} 
              isFlipped={false}
              onClick={() => handleCardClick(card)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Reading;
