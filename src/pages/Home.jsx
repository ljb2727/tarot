import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApiKeyModal from '../components/ApiKeyModal';

const Home = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);

  const handleStart = () => {
    // 질문이 비어있으면 기본 질문 사용
    const finalQuestion = question.trim() || '나의 과거, 현재, 미래는 어떤가요?';
    navigate('/reading', { state: { question: finalQuestion } });
  };

  // 환경 변수에 API 키가 있으면 설정 버튼을 숨김
  const hasEnvKey = !!import.meta.env.VITE_GEMINI_API_KEY;

  return (
    <div 
      className="container" 
      style={{ 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100%'
      }}
    >
      {/* 컨텐츠 영역 */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {!hasEnvKey && (
          <>
            <button
              onClick={() => setShowApiModal(true)}
              style={{
                position: 'absolute',
                top: '0',
                right: '1rem',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                borderRadius: '20px',
                padding: '8px 16px',
                color: '#ffd700',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                zIndex: 10
              }}
            >
              ⚙️ API 설정
            </button>

            <ApiKeyModal 
              isOpen={showApiModal}
              onClose={() => setShowApiModal(false)}
              onSave={() => {}}
            />
          </>
        )}

        <motion.h1 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ fontSize: '4rem', marginBottom: '1rem' }}
        >
          Mystic Tarot
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{ fontSize: '1.5rem', marginBottom: '3rem', maxWidth: '600px' }}
        >
          당신의 운명을 확인해보세요. 카드가 당신에게 들려줄 이야기가 있습니다.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          style={{ width: '100%', maxWidth: '500px', marginBottom: '2rem' }}
        >
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ffd700', fontSize: '1.1rem' }}>
              어떤 고민이 있으신가요?
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="예: 취업을 위해 제가 지금 준비해야 할 것은 무엇인가요?&#13;&#10;(구체적인 상황을 함께 적어주시면 더 좋습니다)"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '0.5rem',
                borderRadius: '10px',
                border: '2px solid rgba(255, 215, 0, 0.3)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                lineHeight: '1.5'
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleStart();
                }
              }}
            />
            <p style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '0.5rem' }}>
              * 구체적일수록 답변도 명확해집니다. '네/아니오' 질문보다는 '어떻게', '무엇'을 묻는 열린 질문이 좋습니다.
            </p>
          </div>
        </motion.div>

        <motion.button
          className="btn-primary"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleStart}
        >
          타로 보기
        </motion.button>
      </div>
    </div>
  );
};

export default Home;
