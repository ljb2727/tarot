import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApiKeyModal from '../components/ApiKeyModal';
import Toast from '../components/Toast';

const Home = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', birthdate: '', job: '', gender: '' });
  const [rememberInfo, setRememberInfo] = useState(false);
  
  // Toast 상태
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // 초기 로드 시 로컬 스토리지 확인
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
  }, []);

  // 정보가 변경되거나 기억하기 상태가 변경될 때 저장/삭제
  React.useEffect(() => {
    if (rememberInfo) {
      localStorage.setItem('tarot_user_info', JSON.stringify(userInfo));
    } else {
      // 기억하기를 껐을 때만 삭제 (초기 로드 시점 제외를 위해 의존성 주의 필요하지만, 
      // 여기서는 간단히 rememberInfo가 false가 되는 순간 삭제하도록 함.
      // 단, 초기값이 false이므로 마운트 시 삭제될 수 있음. 
      // 따라서 마운트 시점에는 실행되지 않도록 하거나, 
      // 로컬스토리지에 데이터가 있는데 rememberInfo가 false인 경우(사용자가 끈 경우)에만 삭제해야 함.
      // 하지만 UX상 끄면 바로 지우는게 맞음. 초기 로드 useEffect가 먼저 실행되어 true로 만들 것이므로 괜찮음.
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
        minHeight: '100%'
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

        <motion.img
          src="/images/ready.png"
          alt="원픽 타로"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ maxWidth: '300px', marginBottom: '2rem' }}
        />

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
                minHeight: '8rem',
                padding: '0.5rem',
                borderRadius: '10px',
                border: '2px solid rgba(255, 215, 0, 0.3)',
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
              <label style={{ color: '#ffd700', fontSize: '0.95rem' }}>
                개인정보 (선택사항)
              </label>
              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  cursor: 'pointer', 
                  fontSize: '0.85rem', 
                  color: rememberInfo ? '#ffd700' : '#aaa',
                  transition: 'color 0.3s'
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: `1px solid ${rememberInfo ? '#ffd700' : '#666'}`,
                  borderRadius: '4px',
                  marginRight: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: rememberInfo ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                  transition: 'all 0.3s'
                }}>
                  {rememberInfo && (
                    <motion.svg 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#ffd700" 
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
              <input type="text" value={userInfo.name} onChange={(e) => setUserInfo({...userInfo, name: e.target.value})} placeholder="이름" style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255, 215, 0, 0.3)', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
              <input 
                type="text" 
                value={userInfo.birthdate} 
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                  setUserInfo({...userInfo, birthdate: val});
                }} 
                placeholder="생년월일 (예: 19900101)" 
                maxLength={8}
                style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255, 215, 0, 0.3)', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', fontSize: '0.9rem', outline: 'none' }} 
              />
              <input type="text" value={userInfo.job} onChange={(e) => setUserInfo({...userInfo, job: e.target.value})} placeholder="직업" style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255, 215, 0, 0.3)', background: 'rgba(255, 255, 255, 0.05)', color: '#fff', fontSize: '0.9rem', outline: 'none' }} />
              <select value={userInfo.gender} onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})} style={{ width: '100%', boxSizing: 'border-box', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255, 215, 0, 0.3)', background: 'rgba(255, 255, 255, 0.05)', color: userInfo.gender ? '#fff' : '#999', fontSize: '0.9rem', outline: 'none' }}>
                <option value="" style={{background: '#1a1a2e'}}>성별</option>
                <option value="남성" style={{background: '#1a1a2e'}}>남성</option>
                <option value="여성" style={{background: '#1a1a2e'}}>여성</option>
                <option value="기타" style={{background: '#1a1a2e'}}>기타</option>
              </select>
            </div>
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
