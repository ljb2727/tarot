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
      
      {/* 선택된 3장의 카드 미리보기 */}
      <div className="selected-cards-display">
        {cards.map((card, index) => (
          <div key={card.id} className="selected-card-item">
            <span className="card-position-label">{positions[index]}</span>
            <Card 
              card={card}
              isFlipped={true}
              style={{ width: '100px', height: '166px', cursor: 'default' }}
            />
            <p className="selected-card-name">
              {card.name_kr}
              {card.isReversed && <span className="reversed-badge">역</span>}
            </p>
          </div>
        ))}
      </div>
      
      <div className="ai-reading-section">
        {!aiReading && !isLoadingAi && (
          <motion.button
            className="btn-ai-reading"
            onClick={handleAiReading}
            disabled={isLoadingAi}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔮 운명 알아보기
          </motion.button>
        )}
        
        {isLoadingAi && (
          <div className="crystal-ball-loading">
            <div className="crystal-ball">
              <div className="crystal-shine"></div>
              <div className="crystal-glow"></div>
              <div className="magic-sparkles">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="sparkle" style={{
                    '--delay': `${i * 0.1}s`,
                    '--angle': `${i * 30}deg`
                  }}></div>
                ))}
              </div>
            </div>
            <p className="loading-text">✨ 운명을 읽는 중...</p>
          </div>
        )}
        
        {aiReading && (
          <motion.div
            className="ai-reading-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {(() => {
              // AI 리딩 텍스트를 섹션별로 분리
              const sections = [];
              const lines = aiReading.split('\n');
              let currentSection = null;
              let currentContent = [];

              lines.forEach(line => {
                // 과거 카드 섹션 감지 (이모지 포함)
                if (line.includes('**과거:') || line.includes('1. 과거:')) {
                  if (currentSection) sections.push({ ...currentSection, content: currentContent.join('\n') });
                  currentSection = { type: 'past', title: line, cardIndex: 0 };
                  currentContent = [];
                } 
                // 현재 카드 섹션 감지
                else if (line.includes('**현재:') || line.includes('2. 현재:')) {
                  if (currentSection) sections.push({ ...currentSection, content: currentContent.join('\n') });
                  currentSection = { type: 'present', title: line, cardIndex: 1 };
                  currentContent = [];
                } 
                // 미래 카드 섹션 감지
                else if (line.includes('**미래:') || line.includes('3. 미래:')) {
                  if (currentSection) sections.push({ ...currentSection, content: currentContent.join('\n') });
                  currentSection = { type: 'future', title: line, cardIndex: 2 };
                  currentContent = [];
                } 
                // 종합 해석 섹션 감지
                else if (line.includes('### 과거-현재-미래') || line.includes('###과거-현재-미래')) {
                  if (currentSection) sections.push({ ...currentSection, content: currentContent.join('\n') });
                  currentSection = { type: 'overall', title: line, cardIndex: null };
                  currentContent = [];
                } 
                // 종합 조언 섹션 감지
                else if (line.includes('**종합 조언') || line.includes('4. 종합 조언')) {
                  if (currentSection) sections.push({ ...currentSection, content: currentContent.join('\n') });
                  currentSection = { type: 'advice', title: line, cardIndex: null };
                  currentContent = [];
                } else if (currentSection) {
                  currentContent.push(line);
                } else {
                  // 헤더 부분 (질문 등)
                  if (!currentSection && line.trim()) {
                    // 구분선(---)이나 빈 줄은 무시
                    if (line.trim().match(/^[-=*]{3,}$/)) return;
                    
                    sections.push({ type: 'header', content: line });
                  }
                }
              });
              
              if (currentSection) {
                sections.push({ ...currentSection, content: currentContent.join('\n') });
              }

              return (
                <div className="reading-sections">
                  {sections.map((section, idx) => {
                    if (section.type === 'header') {
                      return (
                        <div key={idx} className="reading-header" 
                          dangerouslySetInnerHTML={{ 
                            __html: section.content
                              .replace(/### /g, '<h3>')
                              .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
                          }} 
                        />
                      );
                    }

                    if (section.cardIndex !== null && section.cardIndex !== undefined) {
                      // 과거/현재/미래 섹션: 카드 이미지와 함께 표시
                      const card = cards[section.cardIndex];
                      return (
                        <div key={idx} className="reading-section-with-card">
                          <div className="section-card-image">
                            <Card 
                              card={card}
                              isFlipped={true}
                              style={{ width: '120px', height: '200px', cursor: 'default' }}
                            />
                            <p className="section-card-name">
                              {card.name_kr}
                              {card.isReversed && <span className="reversed-badge">역</span>}
                            </p>
                          </div>
                          <div className="section-text">
                            <div dangerouslySetInnerHTML={{ 
                              __html: (section.title + '\n' + section.content)
                                .replace(/\n\n+/g, '\n') // 연속된 개행을 하나로
                                .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
                                .replace(/<b>해석:<\/b>/g, '<br/><b>해석:</b>') // 해석: 앞에 줄바꿈 추가
                                .replace(/\n/g, '<br/>')
                                .replace(/<\/b><br\/>/g, '</b> ') // b 태그 다음 br 제거 및 공백 추가
                            }} />
                          </div>
                        </div>
                      );
                    } else if (section.type === 'overall') {
                      // 종합 해석 섹션
                      return (
                        <div key={idx} className="overall-interpretation-section">
                          <div className="overall-header">
                            <span className="overall-icon">📊</span>
                            <h3>과거-현재-미래 종합 해석</h3>
                          </div>
                          <div className="overall-content" dangerouslySetInnerHTML={{ 
                            __html: section.content
                              .replace(/\n\n+/g, '\n')
                              .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
                              .replace(/\n/g, '<br/>')
                              .replace(/<\/b><br\/>/g, '</b> ')
                          }} />
                        </div>
                      );
                    } else if (section.type === 'advice') {
                      // 전문가 조언 섹션
                      return (
                        <div key={idx} className="expert-advice-section">
                          <div className="advice-header">
                            <span className="advice-icon">🌟</span>
                            <h3>타로 전문가의 조언</h3>
                          </div>
                          <div className="advice-content" dangerouslySetInnerHTML={{ 
                            __html: section.content
                              .replace(/\n\n+/g, '\n')
                              .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
                              .replace(/\n/g, '<br/>')
                              .replace(/<\/b><br\/>/g, '</b> ')
                          }} />
                        </div>
                      );
                    }
                  })}
                </div>
              );
            })()}
          </motion.div>
        )}
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
