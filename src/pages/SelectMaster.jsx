import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SelectMaster = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('aria'); // 'aria' or 'calix'

  const masters = {
    aria: {
      id: 'aria',
      name: '아리아',
      nameEn: 'Aria',
      title: '🌟 정통파 마스터',
      style: '정확하고 담백한 해석',
      description: '"운명의 교향곡을 연주하는 지혜로운 인도자." 아리아는 타로의 정석과 고전적인 지혜를 바탕으로 가장 정확하고 담백한 해석을 제공합니다. 감정에 치우치지 않고 카드가 가리키는 진실을 명확하게 전달합니다.',
      video: 'images/aria.mp4',
      recommend: '처음 타로를 접하는 분이나, 현재 상황에 대한 객관적인 분석을 원할 때',
      color: '#ffd700'
    },
    calix: {
      id: 'calix',
      name: '칼릭스',
      nameEn: 'Calix',
      title: '🔥 매운맛 마스터',
      style: '직설적이고 현실적인 해석',
      description: '"운명에 일침을 놓는 냉철한 현실주의자." 칼릭스는 당신의 달콤한 환상을 깨고 현실을 직시하게 만드는 직설적인 해석을 제공합니다. 숨겨진 내면의 문제, 외면하고 싶었던 진실을 거침없이 드러냅니다.',
      video: 'images/calix.mp4',
      recommend: '강도 높은 조언과 당장 행동해야 할 필요성을 느낄 때',
      color: '#ff4d4d'
    }
  };

  const currentMaster = masters[selectedTab];

  const handleConfirm = () => {
    localStorage.setItem('selected_master', selectedTab);
    navigate('/home');
  };

  return (
    <div 
      className="container" 
      style={{ 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        minHeight: '100svh',
        padding: '2rem 1rem',
        paddingBottom: '100px' // 하단 버튼 공간 확보
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ 
          fontSize: '2rem', 
          marginBottom: '2rem',
          textAlign: 'center',
          color: currentMaster.color,
          transition: 'color 0.3s ease'
        }}
      >
        타로 마스터 선택
      </motion.h1>

      {/* 탭 네비게이션 */}
      <div style={{ 
        display: 'flex', 
        background: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '30px', 
        padding: '5px',
        marginBottom: '2rem',
        width: '100%',
        maxWidth: '350px'
      }}>
        {Object.values(masters).map((master) => (
          <div
            key={master.id}
            onClick={() => setSelectedTab(master.id)}
            style={{
              flex: 1,
              padding: '10px 0',
              textAlign: 'center',
              borderRadius: '25px',
              cursor: 'pointer',
              background: selectedTab === master.id ? master.color : 'transparent',
              color: selectedTab === master.id ? '#0f0c29' : '#aaa',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              position: 'relative',
              zIndex: 1
            }}
          >
            {master.name}
          </div>
        ))}
      </div>

      {/* 마스터 정보 카드 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '100%',
            maxWidth: '500px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '20px',
            padding: '1.5rem',
            border: `2px solid ${currentMaster.color}`,
            boxShadow: `0 0 20px ${currentMaster.color}40`
          }}
        >
          <video
            src={currentMaster.video}
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '250px',
              objectFit: 'cover',
              borderRadius: '15px',
              marginBottom: '1.5rem',
              border: `1px solid ${currentMaster.color}40`
            }}
          />

          <h2 style={{ 
            fontSize: '1.5rem', 
            color: currentMaster.color, 
            marginBottom: '0.5rem',
            textAlign: 'center'
          }}>
            {currentMaster.title}
          </h2>

          <p style={{ 
            fontSize: '1rem', 
            color: '#ddd', 
            marginBottom: '1.5rem',
            textAlign: 'center',
            fontWeight: 'bold'
          }}>
            {currentMaster.style}
          </p>

          <div style={{ 
            background: 'rgba(0, 0, 0, 0.2)', 
            padding: '1rem', 
            borderRadius: '10px',
            marginBottom: '1rem'
          }}>
            <p style={{ 
              fontSize: '0.9rem', 
              lineHeight: '1.6',
              color: '#ccc'
            }}>
              {currentMaster.description}
            </p>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <span style={{ color: currentMaster.color, fontSize: '0.9rem', fontWeight: 'bold' }}>추천: </span>
            <span style={{ fontSize: '0.9rem', color: '#aaa' }}>{currentMaster.recommend}</span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 선택 버튼 - 하단 고정 */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="btn-primary"
        onClick={handleConfirm}
        style={{
          position: 'fixed',
          bottom: 'max(env(safe-area-inset-bottom), 20px)',
          left: '1rem',
          right: '1rem',
          zIndex: 1000,
          maxWidth: '400px',
          margin: '0 auto',
          background: `linear-gradient(135deg, ${currentMaster.color} 0%, ${selectedTab === 'aria' ? '#ffed4e' : '#ff8080'} 100%)`,
          color: '#0f0c29',
          fontWeight: 'bold',
          padding: '1rem',
          fontSize: '1.1rem',
          border: 'none',
          borderRadius: '50px',
          cursor: 'pointer',
          boxShadow: `0 4px 15px ${currentMaster.color}60`
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {currentMaster.name} 마스터와 상담하기
      </motion.button>
    </div>
  );
};

export default SelectMaster;
