import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import ApiKeyModal from '../components/ApiKeyModal';
import ImageModal from '../components/ImageModal';
import AdLoadingScreen from '../components/AdLoadingScreen';
import { generateTarotReading } from '../utils/gemini';
import { storage } from '../utils/storage';
import '../styles/Result.css';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cards, question, userInfo } = location.state || { cards: [], question: '', userInfo: {} };
  const [showApiModal, setShowApiModal] = useState(false);
  const [aiReading, setAiReading] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [showAdLoading, setShowAdLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [selectedImageInfo, setSelectedImageInfo] = useState(null);

  useEffect(() => {
    // 카드나 질문이 없으면 홈으로 리다이렉트
    if (!cards || cards.length === 0 || !question) {
      navigate('/', { replace: true });
      return;
    }
    
    // 1. 환경 변수에서 API 키 확인 (고정 키)
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envKey) {
      setApiKey(envKey);
      return;
    }

    // 2. 로컬 스토리지에서 API 키 가져오기 (사용자 설정 키)
    const savedKey = storage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, [cards, question, navigate]);

  const handleAiReading = async () => {
    if (!apiKey) {
      setShowApiModal(true);
      return;
    }

    // 광고 로딩 화면 표시
    setShowAdLoading(true);
  };

  const handleAdComplete = async () => {
    // 광고 시청 완료 후 AI 리딩 시작
    setShowAdLoading(false);
    setIsLoadingAi(true);
    
    try {
      const reading = await generateTarotReading(cards, apiKey, question, userInfo);
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

  const openImageModal = (card) => {
    setSelectedImageInfo({
      imageSrc: card.image,
      altText: card.name_kr,
      isReversed: card.isReversed
    });
  };

  const closeImageModal = () => {
    setSelectedImageInfo(null);
  };

  if (cards.length === 0) return null;

  const positions = ['과거', '현재', '미래'];

  return (
    <>
      {/* 광고 로딩 화면 */}
      {showAdLoading && (
        <AdLoadingScreen 
          onAdComplete={handleAdComplete}
          minDisplayTime={5000} // 5초 최소 광고 시청 시간
        />
      )}

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
              style={{ width: '100px', height: '166px', cursor: 'pointer' }}
              onClick={() => openImageModal(card)}
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
                const trimmedLine = line.trim();
                
                // 과거 카드 섹션 감지
                if (trimmedLine.includes('**과거:') || trimmedLine.includes('1. 과거:') || trimmedLine.includes('** 과거:')) {
                  if (currentSection) sections.push({ ...currentSection, content: currentContent.join('\n') });
                  currentSection = { type: 'past', title: line, cardIndex: 0 };
                  currentContent = [];
                } 
                // 현재 카드 섹션 감지
                else if (trimmedLine.includes('**현재:') || trimmedLine.includes('2. 현재:') || trimmedLine.includes('** 현재:')) {
                  if (currentSection) sections.push({ ...currentSection, content: currentContent.join('\n') });
                  currentSection = { type: 'present', title: line, cardIndex: 1 };
                  currentContent = [];
                } 
                // 미래 카드 섹션 감지
                else if (trimmedLine.includes('**미래:') || trimmedLine.includes('3. 미래:') || trimmedLine.includes('** 미래:')) {
                  if (currentSection) sections.push({ ...currentSection, content: currentContent.join('\n') });
                  currentSection = { type: 'future', title: line, cardIndex: 2 };
                  currentContent = [];
                } 
                // 종합 해석 섹션 감지
                else if (trimmedLine.includes('### 과거-현재-미래') || trimmedLine.includes('###과거-현재-미래')) {
                  if (currentSection) sections.push({ ...currentSection, content: currentContent.join('\n') });
                  currentSection = { type: 'overall', title: line, cardIndex: null };
                  currentContent = [];
                } 
                // 종합 조언 섹션 감지
                else if (trimmedLine.includes('**종합 조언') || trimmedLine.includes('4. 종합 조언') || trimmedLine.includes('** 종합 조언')) {
                  if (currentSection) sections.push({ ...currentSection, content: currentContent.join('\n') });
                  currentSection = { type: 'advice', title: line, cardIndex: null };
                  currentContent = [];
                } else if (currentSection) {
                  currentContent.push(line);
                } else {
                  // 헤더 부분 (질문 등)
                  if (!currentSection && trimmedLine) {
                    // 구분선(---)이나 빈 줄은 무시 (더 강력한 필터링)
                    if (trimmedLine.match(/^[-=*_]{3,}$/) || trimmedLine === '---') return;
                    
                    sections.push({ type: 'header', content: line });
                  }
                }
              });
              
              if (currentSection) {
                sections.push({ ...currentSection, content: currentContent.join('\n') });
              }

              console.log('Parsed Sections:', sections); // 디버깅용 로그

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
                              style={{ width: '120px', height: '200px', cursor: 'pointer' }}
                              onClick={() => openImageModal(card)}
                            />
                            <p className="section-card-name">
                              {card.name_kr}
                              {card.isReversed && <span className="reversed-badge">역</span>}
                            </p>
                            <button 
                              className="btn-view-image"
                              onClick={() => openImageModal(card)}
                              style={{
                                marginTop: '0.5rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                color: '#ddd',
                                padding: '4px 10px',
                                borderRadius: '15px',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              🔍 크게 보기
                            </button>
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
                        <div key={idx} className="reading-section-with-card overall-section">
                          <div className="section-card-image">
                            <div className="large-icon-display">📊</div>
                            <p className="section-card-name">종합 해석</p>
                          </div>
                          <div className="section-text">
                            <div className="overall-header-text">
                              <h3>과거-현재-미래 종합 해석</h3>
                            </div>
                            <div dangerouslySetInnerHTML={{ 
                              __html: section.content
                                .replace(/\n\n+/g, '\n')
                                .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
                                .replace(/\n/g, '<br/>')
                                .replace(/<\/b><br\/>/g, '</b> ')
                            }} />
                          </div>
                        </div>
                      );
                    } else if (section.type === 'advice') {
                      // 전문가 조언 섹션
                      return (
                        <div key={idx} className="reading-section-with-card advice-section">
                          <div className="section-card-image">
                            <div className="large-icon-display">🌟</div>
                          </div>
                          <div className="section-text">
                            <div className="advice-header-text">
                              <h3>타로 전문가의 조언</h3>
                            </div>
                            <div dangerouslySetInnerHTML={{ 
                              __html: section.content
                                .replace(/\n\n+/g, '\n')
                                .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
                                .replace(/\n/g, '<br/>')
                                .replace(/<\/b><br\/>/g, '</b> ')
                            }} />
                          </div>
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
      
      {aiReading && (
        <div className="action-buttons">
          <button className="btn-primary" onClick={() => navigate('/home')}>
            다시 하기
          </button>
        </div>
      )}

      <ApiKeyModal 
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        onSave={handleApiKeySave}
      />

      <ImageModal
        isOpen={!!selectedImageInfo}
        onClose={closeImageModal}
        imageSrc={selectedImageInfo?.imageSrc}
        altText={selectedImageInfo?.altText}
        isReversed={selectedImageInfo?.isReversed}
      />
    </div>
    </>
  );
};

export default Result;
