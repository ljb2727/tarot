import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDeck, shuffleDeck } from '../utils/tarot';
import Card from '../components/Card';
import '../styles/Reading.css';

const Reading = () => {
  const baseUrl = import.meta.env.BASE_URL;
  const [deck, setDeck] = useState([]);
  const [piles, setPiles] = useState([[], [], []]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showShuffleOverlay, setShowShuffleOverlay] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { question } = location.state || { question: '' };

  useEffect(() => {
    if (!question) {
      navigate('/', { replace: true });
      return;
    }
    initializeDeck();
  }, [question, navigate]);

  const initializeDeck = () => {
    const initialDeck = getDeck();
    const shuffled = shuffleDeck(initialDeck);
    setDeck(shuffled);
    distributePiles(shuffled);
  };

  const distributePiles = (currentDeck) => {
    const chunkSize = Math.ceil(currentDeck.length / 3);
    const newPiles = [
      currentDeck.slice(0, chunkSize),
      currentDeck.slice(chunkSize, chunkSize * 2),
      currentDeck.slice(chunkSize * 2)
    ];
    setPiles(newPiles);
  };

  const handleShuffle = () => {
    if (selectedCards.length > 0 || isShuffling) return;
    
    setIsShuffling(true);
    setShowShuffleOverlay(false); // 애니메이션을 위해 잠시 숨김
    
    // 1. 셔플 로직 실행 (데이터 업데이트)
    const shuffled = shuffleDeck(deck);
    setDeck(shuffled);
    
    // 2. 애니메이션 시간 후 상태 복귀 및 뭉치 재분배
    setTimeout(() => {
      distributePiles(shuffled);
      setIsShuffling(false);
      setShowShuffleOverlay(true); // 애니메이션 끝나면 다시 표시
    }, 2000); // 2초 동안 애니메이션
  };

  const handleSkipShuffle = () => {
    setShowShuffleOverlay(false); // 영구히 닫음 (카드 선택 단계로)
  };

  const handlePileClick = (pileIndex) => {
    if (selectedCards.length >= 3 || isShuffling) return;

    const currentPile = piles[pileIndex];
    if (currentPile.length === 0) return;

    const selectedCard = currentPile[currentPile.length - 1];
    const newSelected = [...selectedCards, selectedCard];
    setSelectedCards(newSelected);

    const newPiles = [...piles];
    newPiles[pileIndex] = currentPile.slice(0, -1);
    setPiles(newPiles);

    if (newSelected.length === 3) {
      setTimeout(() => {
        navigate('/result', { state: { cards: newSelected, question } });
      }, 1000);
    }
  };

  return (
    <div className="container reading-container">
      <div className="question-display">
        <span className="question-label">Q.</span>
        <span className="question-text">{question}</span>
      </div>
      
      <h2>
        {isShuffling ? "운명을 섞는 중..." : 
         selectedCards.length < 3 ? "마음에 드는 카드 뭉치를 선택하세요" : "운명을 확인하는 중..."}
      </h2>
      
      <p className="instruction">
        {!isShuffling && selectedCards.length === 0 && "첫 번째 카드: 과거"}
        {!isShuffling && selectedCards.length === 1 && "두 번째 카드: 현재"}
        {!isShuffling && selectedCards.length === 2 && "세 번째 카드: 미래"}
      </p>

      {/* 셔플 버튼 및 선택 버튼 (중앙 고정 오버레이) */}
      {selectedCards.length === 0 && !isShuffling && showShuffleOverlay && (
        <div className="shuffle-overlay">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
            <motion.button
              className="btn-shuffle"
              onClick={handleShuffle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 카드 섞기
            </motion.button>
            <motion.button
              className="btn-select-now"
              onClick={handleSkipShuffle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              👉 바로 선택하기
            </motion.button>
          </div>
        </div>
      )}

      {/* 선택된 카드 프리뷰 */}
      <div className="selected-preview" style={{ minHeight: '200px', marginBottom: '1rem', overflow: 'visible' }}>
        {selectedCards.map((card, idx) => (
          <motion.div 
            key={card.id} 
            className="preview-card"
            layoutId={`card-${card.id}`}
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 180 }}
            transition={{ duration: 0.8 }}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1000px',
              position: 'relative'
            }}
          >
            {/* 카드 앞면 (결과 이미지) */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <img 
                src={card.image} 
                alt={card.name_kr}
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  transform: card.isReversed ? 'rotate(180deg)' : 'none'
                }}
                onError={(e) => { e.target.src = `${baseUrl}cards/card_back.png`; }}
              />
              <p style={{ marginTop: '5px' }}>
                {['과거', '현재', '미래'][idx]}
                {card.isReversed && <span style={{ color: '#ff6b6b', fontSize: '0.8em' }}> (역)</span>}
              </p>
            </div>

            {/* 카드 뒷면 (패턴 이미지) */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <img 
                src={`${baseUrl}cards/card_back.png`} 
                alt="Card Back"
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '10px'
                }} 
              />
            </div>
          </motion.div>
        ))}
        {[...Array(3 - selectedCards.length)].map((_, i) => (
          <div key={`empty-${i}`} className="preview-card empty-slot">
            <div className="empty-circle"></div>
          </div>
        ))}
      </div>

      {/* 셔플 애니메이션용 카드들 */}
      {isShuffling && (
        <div className="shuffle-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`shuffle-${i}`}
              className="shuffle-card"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: [0, (Math.random() - 0.5) * 600, 0], // 흩어졌다 모이기
                y: [0, (Math.random() - 0.5) * 600, 0],
                rotate: [0, Math.random() * 720, 0], // 회전
                scale: [1, 0.8, 1]
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '80px',
                height: '130px',
                marginLeft: '-40px',
                marginTop: '-65px',
                backgroundImage: `url(${baseUrl}cards/card_back.png)`,
                backgroundSize: 'cover',
                borderRadius: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                zIndex: 100
              }}
            />
          ))}
        </div>
      )}

      {/* 3개의 카드 뭉치 (셔플 중에는 숨김) */}
      {!isShuffling && (
        <div className="card-piles-container">
          {piles.map((pile, index) => (
            <motion.div
              key={`pile-${index}`}
              className="card-pile"
              onClick={() => handlePileClick(index)}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {[...Array(Math.min(pile.length, 5))].map((_, i) => {
                const isTopCard = i === Math.min(pile.length, 5) - 1;
                const topCard = pile[pile.length - 1];
                
                return (
                  <motion.div 
                    key={i} 
                    className="pile-card-layer"
                    layoutId={isTopCard && topCard ? `card-${topCard.id}` : undefined}
                    style={{ 
                      transform: `translateY(-${i * 2}px) translateZ(${i}px)`,
                      zIndex: i 
                    }}
                  >
                    <img src={`${baseUrl}cards/card_back.png`} alt="Card Back" />
                  </motion.div>
                );
              })}
              <div className="pile-count">{pile.length}장</div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reading;
