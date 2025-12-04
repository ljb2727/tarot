import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApiKeyModal from '../components/ApiKeyModal';
import Toast from '../components/Toast';

const Home = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [question, setQuestion] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', birthdate: '', job: '', gender: '' });
  const [rememberInfo, setRememberInfo] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  // Toast 상태
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // 초기 로드 시 로컬 스토리지 확인 및 테마 적용
  React.useEffect(() => {
    const savedInfo = localStorage.getItem('tarot_user_info');
    if (savedInfo) {
      try {
        setUserInfo(JSON.parse(savedInfo));
        setRememberInfo(true);
      } catch (e) {
        console.error('Failed to parse saved user info', e);
      }
    }

    // 테마 강제 적용
    const selectedMaster = localStorage.getItem('selected_master') || 'aria';
    const root = document.documentElement;
    if (selectedMaster === 'calix') {
      root.style.setProperty('--color-primary', '#ff4d4d');
      root.style.setProperty('--color-secondary', '#c0392b');
      root.style.setProperty('--color-btn-gradient', 'linear-gradient(135deg, #ff4d4d 0%, #ff8080 100%)');
      root.style.setProperty('--color-shadow-primary', 'rgba(255, 77, 77, 0.4)');
    } else {
      root.style.setProperty('--color-primary', '#ffd700');
      root.style.setProperty('--color-secondary', '#9b59b6');
      root.style.setProperty('--color-btn-gradient', 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)');
      root.style.setProperty('--color-shadow-primary', 'rgba(255, 215, 0, 0.4)');
    }
  }, []);

  // 정보가 변경되거나 기억하기 상태가 변경될 때 저장/삭제
  React.useEffect(() => {
    if (rememberInfo) {
      localStorage.setItem('tarot_user_info', JSON.stringify(userInfo));
    } else {
      if (localStorage.getItem('tarot_user_info')) {
         localStorage.removeItem('tarot_user_info');
      }
    }
  }, [userInfo, rememberInfo]);



  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleStart = () => {
    const trimmedQuestion = question.trim();
    
    // 비어있거나 5글자 미만이면 경고
    if (!trimmedQuestion || trimmedQuestion.length < 5) {
      showToastMessage('고민을 5글자 이상 입력해주세요.');
      return;
    }

    navigate('/reading', { 
      state: { 
        question: trimmedQuestion,
        userInfo: userInfo
      } 
    });
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
        minHeight: '100svh',
        paddingBottom: '120px' // 하단 버튼 공간 확보
      }}
    >
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />

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
                color: 'var(--color-primary)',
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

        <motion.video
          ref={videoRef}
          src="images/ready.mp4"
          autoPlay
          loop
          muted
          playsInline
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            boxShadow: [
              '0 0 10px var(--color-shadow-primary)',
              '0 0 20px var(--color-shadow-primary)',
              '0 0 10px var(--color-shadow-primary)'
            ]
          }}
          transition={{ 
            opacity: { duration: 0.5 },
            boxShadow: { 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }
          }}
          style={{ 
            width: '100%', 
            maxWidth: '600px',
            marginBottom: '2rem',
            border: '3px solid var(--color-primary)',
            borderRadius: '15px',
            boxShadow: '0 0 20px var(--color-shadow-primary)',
            objectFit: 'cover'
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          style={{ width: '100%', maxWidth: '500px', marginBottom: '2rem' }}
        >
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-primary)', fontSize: '1.1rem' }}>
              어떤 고민이 있으신가요?
            </label>
            <textarea
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (!isTyping && e.target.value.length > 0) {
                  setIsTyping(true);
                } else if (e.target.value.length === 0) {
                  setIsTyping(false);
                }
              }}
              placeholder="예: 취업을 위해 제가 지금 준비해야 할 것은 무엇인가요?&#13;&#10;"
              style={{
                width: '100%',
                minHeight: '5rem',
                padding: '0.5rem',
                borderRadius: '10px',
                border: '2px solid var(--color-primary)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                resize: 'none',
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

          {/* 개인정보 입력 (선택사항) */}
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                추가 정보(선택사항)
              </label>
              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                  fontSize: '0.85rem', 
                  color: rememberInfo ? 'var(--color-primary)' : '#aaa',
                  transition: 'color 0.3s'
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: `1px solid ${rememberInfo ? 'var(--color-primary)' : '#666'}`,
                  borderRadius: '4px',
                  marginRight: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: rememberInfo ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  transition: 'all 0.3s'
                }}>
                  {rememberInfo && (
                    <motion.svg 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="var(--color-primary)" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      style={{ width: '10px', height: '10px' }}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  )}
                </div>
                <input 
                  type="checkbox" 
                  checked={rememberInfo} 
                  onChange={(e) => setRememberInfo(e.target.checked)} 
                  style={{ display: 'none' }} 
                />
                기억하기
              </label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%' }}>
              <input type="text" value={userInfo.name} onChange={(e) => setUserInfo({...userInfo, name: e.target.value})} placeholder="이름" style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-primary)', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
              <input 
                type="text" 
                value={userInfo.birthdate} 
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                  setUserInfo({...userInfo, birthdate: val});
                }} 
                placeholder="생년월일 (예: 19900101)" 
                maxLength={8}
                style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-primary)', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', fontSize: '0.9rem', outline: 'none' }} 
              />
              <input type="text" value={userInfo.job} onChange={(e) => setUserInfo({...userInfo, job: e.target.value})} placeholder="직업" style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-primary)', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
              <select value={userInfo.gender} onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})} style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--color-primary)', background: 'rgba(255, 255, 255, 0.05)', color: userInfo.gender ? '#fff' : '#999', fontSize: '0.9rem', outline: 'none' }}>
                <option value="" style={{background: '#1a1a2e'}}>성별</option>
                <option value="남성" style={{background: '#1a1a2e'}}>남성</option>
                <option value="여성" style={{background: '#1a1a2e'}}>여성</option>
                <option value="기타" style={{background: '#1a1a2e'}}>기타</option>
              </select>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.5rem', lineHeight: '1.4' }}>
              ℹ️ 추가 정보를 입력하면 더 자세하고 개인화된 해석을 받을 수 있습니다.<br />
              🔒 모든 정보는 기기에만 저장되며 서버로 전송되지 않습니다.
            </p>
          </div>
        </motion.div>
      </div>

      {/* 하단 고정 버튼 */}
      <motion.button
        className="btn-primary"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStart}
        style={{
          position: 'fixed',
          bottom: '50px',
          left: '1rem',
          right: '1rem',
          zIndex: 1000,
          maxWidth: '400px',
          margin: '0 auto',
          backgroundImage: 'var(--color-btn-gradient)',
          color: '#0f0c29',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px var(--color-shadow-primary)'
        }}
      >
        타로 보기
      </motion.button>
    </div>
  );
};

export default Home;
