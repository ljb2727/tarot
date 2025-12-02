import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import ApiKeyModal from '../components/ApiKeyModal';
import { generateTarotReading } from '../utils/gemini';
import '../styles/Result.css';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cards, question } = location.state || { cards: [], question: '' };
  const [flippedCards, setFlippedCards] = useState([false, false, false]);
  const [showApiModal, setShowApiModal] = useState(false);
  const [aiReading, setAiReading] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (cards.length === 0) {
      navigate('/');
    }
    
    // 로컬 스토리지에서 API 키 가져오기
    try {
      const savedKey = localStorage.getItem('gemini_api_key');
      if (savedKey) {
        setApiKey(savedKey);
      }
    } catch (error) {
      console.warn('localStorage 접근 불가:', error);
    }
  }, [cards, navigate]);

  useEffect(() => {
    // 각 카드를 순차적으로 뒤집기
    const timers = [];
    cards.forEach((_, index) => {
      const timer = setTimeout(() => {
        setFlippedCards(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, 1000 + index * 1500);
      timers.push(timer);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [cards]);

  const handleAiReading = async () => {
    if (!apiKey) {
      setShowApiModal(true);
      return;
    }

    setIsLoadingAi(true);
    try {
      const reading = await generateTarotReading(cards, apiKey, question);
      setAiReading(reading);
    } catch (error) {
      alert(error.message || 'AI 해석 생성 중 오류가 발생했습니다.');
      if (error.message.includes('API')) {
        setShowApiModal(true);
      }
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleApiKeySave = (newKey) => {
    setApiKey(newKey);
    handleAiReading();
  };

  if (cards.length === 0) return null;

  const positions = ['과거', '현재', '미래'];

  return (
    <div className="container result-container">
      <div className="question-display" style={{ margin: '0 auto 2rem auto' }}>
        <span className="question-label">Q.</span>
        <span className="question-text">{question}</span>
      </div>
      <h2>당신의 운명</h2>
      
      <div className="ai-reading-section">
        {!aiReading && (
          <motion.button
            className="btn-ai-reading"
            onClick={handleAiReading}
            disabled={isLoadingAi}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoadingAi ? '✨ AI가 해석 중...' : '🤖 AI 타로 리딩 받기'}
          </motion.button>
        )}
        
        {aiReading && (
          <motion.div
            className="ai-reading-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div 
              className="reading-text"
              dangerouslySetInnerHTML={{ 
                __html: aiReading
                  .replace(/### /g, '<h3>')
                  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\n/g, '<br/>')
              }}
            />
          </motion.div>
        )}
      </div>

      <div className="results-grid">
        {cards.map((card, index) => (
          <motion.div 
            key={card.id}
            className="result-card-wrapper"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.5, duration: 0.8 }}
          >
            <h3 className="position-title">{positions[index]}</h3>
            <div className="card-display">
              <Card 
                card={card} 
                isFlipped={flippedCards[index]}
                style={{ cursor: 'default' }}
              />
            </div>
            <motion.div 
              className="card-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: flippedCards[index] ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <h4>
                {card.name_kr}
                {card.isReversed && <span style={{ color: '#ff6b6b', fontSize: '0.8em', marginLeft: '0.5rem' }}>(역방향)</span>}
              </h4>
              <p className="card-name-en">{card.name_en}</p>
              <p className="card-desc">
                이 카드는 당신의 {positions[index]}에 대한 중요한 메시지를 담고 있습니다.
                {card.image_prompt.split('.')[1]}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      <div className="action-buttons">
        <button className="btn-primary" onClick={() => navigate('/')}>
          다시 하기
        </button>
        <button 
          className="btn-secondary" 
          onClick={() => setShowApiModal(true)}
        >
          ⚙️ API 키 설정
        </button>
      </div>

      <ApiKeyModal 
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        onSave={handleApiKeySave}
      />
    </div>
  );
};

export default Result;
