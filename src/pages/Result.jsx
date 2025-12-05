import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import ApiKeyModal from '../components/ApiKeyModal';
import ImageModal from '../components/ImageModal';
import AdLoadingScreen from '../components/AdLoadingScreen';
import { generateTarotReading } from '../utils/gemini';
import { storage } from '../utils/storage';
import { saveHistory } from '../utils/historyStorage';
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
  const [waitingForAi, setWaitingForAi] = useState(false); // 광고 완료 후 AI 대기 중인지 여부
  const readingRef = useRef(null); // 스크롤 타겟 ref

  // AI 해석 완료 시 스크롤 이동
  useEffect(() => {
    if (aiReading && readingRef.current) {
      setTimeout(() => {
        const root = document.getElementById('root');
        if (root) {
          // 헤더 높이(60px) + 여유 공간(20px) 고려하여 스크롤
          const headerHeight = 60;
          const extraSpace = 20;
          const elementTop = readingRef.current.getBoundingClientRect().top;
          const currentScroll = root.scrollTop;
          
          // 현재 스크롤 위치 + (요소의 화면상 위치 - 상단 여백)
          const targetScroll = currentScroll + elementTop - (headerHeight + extraSpace);
          
          root.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
      }, 500); 
    }
  }, [aiReading]);

  // AI 해석이 완료되면 로딩 상태 해제 (광고 시청 완료 후 대기 중일 때)
  useEffect(() => {
    if (waitingForAi && aiReading) {
      setIsLoadingAi(false);
      setWaitingForAi(false);
    }
  }, [aiReading, waitingForAi]);

  // AI 해석 완료 시 히스토리에 자동 저장
  useEffect(() => {
    if (aiReading && cards && question) {
      saveHistory({
        question,
        userInfo,
        cards,
        aiReading,
        selectedMaster: localStorage.getItem('selected_master') || 'aria'
      });
    }
  }, [aiReading]);

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

    // AI 해석을 광고와 병렬로 시작
    (async () => {
      try {
        const reading = await generateTarotReading(cards, apiKey, question, userInfo);
        setAiReading(reading);
      } catch (error) {
        console.error('AI 해석 생성 오류:', error);
        // 에러 발생 시 aiReading을 null로 설정하여 handleAdComplete에서 처리
        setAiReading(null); 
      }
    })();
  };

  const handleAdComplete = async () => {
    // 광고 시청 완료
    setShowAdLoading(false);
    
    // AI 해석이 아직 완료되지 않았으면 로딩 표시 및 대기
    if (!aiReading) {
      setIsLoadingAi(true);
      setWaitingForAi(true);
      
      // 30초 타임아웃 설정 (안전장치)
      setTimeout(() => {
        // 타임아웃 시점에도 여전히 대기 중이고 결과가 없다면 에러 처리
        setWaitingForAi(prev => {
          if (prev) {
            setIsLoadingAi(false);
            alert('AI 해석 생성 시간이 초과되었습니다. 다시 시도해주세요.');
            return false;
          }
          return prev;
        });
      }, 30000);
    }
    // AI 해석이 이미 완료되었으면 바로 결과 화면으로 (로딩 없음)
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
      {!aiReading && !isLoadingAi && (
        <>
          <h2 style={{ color: '#fff' }}>당신의 운명</h2>
          
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
                <p className="selected-card-name" style={{ color: '#fff', maxWidth: '100px', wordWrap: 'break-word', textAlign: 'center' }}>
                  {card.name_kr}
                  {card.isReversed && <span className="reversed-badge">역</span>}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
      
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
        
        {(isLoadingAi || aiReading) && (
          <div className="loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0' }}>
            <motion.video
              src={localStorage.getItem('selected_master') === 'calix' ? 'images/calix.mp4' : 'images/aria.mp4'}
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={(e) => {
                e.target.style.opacity = 1;
              }}
              animate={{ 
                boxShadow: aiReading 
                  ? '0 0 40px var(--color-primary), 0 0 80px var(--color-shadow-primary), 0 0 120px var(--color-shadow-primary)' // 해석 완료 시 고정
                  : [
                      '0 0 20px var(--color-primary), 0 0 40px var(--color-shadow-primary)',
                      '0 0 40px var(--color-primary), 0 0 80px var(--color-shadow-primary), 0 0 120px var(--color-shadow-primary)',
                      '0 0 20px var(--color-primary), 0 0 40px var(--color-shadow-primary)'
                    ]
              }}
              transition={{ 
                boxShadow: { 
                  duration: aiReading ? 0.5 : 1.5, 
                  repeat: aiReading ? 0 : Infinity, 
                  ease: "easeInOut" 
                }
              }}
              style={{
                width: '100%',
                maxWidth: '300px',
                height: '300px',
                objectFit: 'cover',
                borderRadius: '50%',
                border: '4px solid var(--color-primary)',
                opacity: 0,
                transition: 'opacity 0.5s ease-in-out',
                marginBottom: '1rem'
              }}
            />
            <motion.p
              animate={{ opacity: isLoadingAi ? [0.5, 1, 0.5] : 1 }}
              transition={{ duration: 1.5, repeat: isLoadingAi ? Infinity : 0 }}
              style={{ color: 'var(--color-primary)', fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'center' }}
            >
              {isLoadingAi ? (
                localStorage.getItem('selected_master') === 'calix' 
                  ? '칼릭스가 운명의 흐름을 꿰뚫어 보고 있습니다...' 
                  : '아리아가 별들의 목소리를 듣고 있습니다...'
              ) : (
                localStorage.getItem('selected_master') === 'calix'
                  ? '칼릭스가 당신에게 전하는 직설적인 조언입니다.'
                  : '아리아가 당신에게 전하는 운명의 메시지입니다.'
              )}
            </motion.p>
          </div>
        )}
        
        {aiReading && (
          <motion.div
            ref={readingRef}
            className="ai-reading-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ color: '#fff' }} // 글자색 흰색 강제
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
                            <div style={{ 
                              marginBottom: '0.5rem', 
                              color: '#fff', 
                              fontSize: '1.1rem', 
                              fontWeight: 'bold',
                              borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                              paddingBottom: '0.2rem',
                              width: '100%',
                              textAlign: 'center'
                            }}>
                              {section.type === 'past' ? '과거' : section.type === 'present' ? '현재' : '미래'}
                            </div>
                            <Card 
                              card={card}
                              isFlipped={true}
                              style={{ width: '120px', height: '200px', cursor: 'pointer' }}
                              onClick={() => openImageModal(card)}
                            />
                            <p className="section-card-name" style={{ color: '#fff', maxWidth: '120px', wordWrap: 'break-word', textAlign: 'center' }}>
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
                            <p className="section-card-name" style={{ color: '#fff', maxWidth: '120px', wordWrap: 'break-word', textAlign: 'center' }}>종합 해석</p>
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
                      const selectedMaster = localStorage.getItem('selected_master') || 'aria';
                      const masterName = selectedMaster === 'aria' ? '아리아' : '칼릭스';
                      const masterColor = selectedMaster === 'calix' ? '#ff4d4d' : '#ffd700';
                      
                      return (
                        <div key={idx} className="reading-section-with-card advice-section">
                          <div className="section-card-image">
                            <div className="large-icon-display" style={{ color: masterColor }}>🌟</div>
                          </div>
                          <div className="section-text">
                            <div className="advice-header-text">
                              <h3 style={{ color: masterColor }}>타로 마스터 {masterName}의 조언</h3>
                            </div>
                            <div dangerouslySetInnerHTML={{ 
                              __html: section.content
                                .trim()
                                .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
                                .replace(/\n/g, '<br/>')
                                .replace(/(\d+\.\s)/g, '<br/><br/>$1')
                                .replace(/(당장 행동해야 할|즉시 포기해야 할)/g, '<br/><br/>$1')
                                .replace(/(<br\/>\s*){3,}/g, '<br/><br/>') // br 3개 이상은 2개로
                                .replace(/^(<br\/>\s*)+/, '') // 맨 앞 br 제거
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
        <div className="action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <button className="btn-primary" onClick={() => navigate('/home')}>
            다시 하기
          </button>
          <button 
            className="btn-primary" 
            onClick={() => navigate('/select-master')}
            style={{
              background: 'transparent',
              border: '2px solid var(--color-primary)',
              color: 'var(--color-primary)'
            }}
          >
            타로마스터 다시선택
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
