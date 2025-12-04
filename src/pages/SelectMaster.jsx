import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SelectMaster = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMaster, setSelectedMaster] = useState(null);
  const [dragDirection, setDragDirection] = useState(0);

  const masters = [
    {
      id: 'aria',
      name: '아리아',
      nameEn: 'Aria',
      title: '🌟 정통파 마스터',
      style: '정확하고 담백한 해석',
      description: '"운명의 교향곡을 연주하는 지혜로운 인도자." 아리아는 타로의 정석과 고전적인 지혜를 바탕으로 가장 정확하고 담백한 해석을 제공합니다. 감정에 치우치지 않고 카드가 가리키는 진실을 명확하게 전달합니다.',
      video: 'images/aria.mp4',
      recommend: '처음 타로를 접하는 분이나, 현재 상황에 대한 객관적인 분석을 원할 때'
    },
    {
      id: 'calix',
      name: '칼릭스',
      nameEn: 'Calix',
      title: '🔥 매운맛 마스터',
      style: '직설적이고 현실적인 해석',
      description: '"운명에 일침을 놓는 냉철한 현실주의자." 칼릭스는 당신의 달콤한 환상을 깨고 현실을 직시하게 만드는 직설적인 해석을 제공합니다. 숨겨진 내면의 문제, 외면하고 싶었던 진실을 거침없이 드러냅니다.',
      video: 'images/calix.mp4',
      recommend: '강도 높은 조언과 당장 행동해야 할 필요성을 느낄 때'
    }
  ];

  const currentMaster = masters[currentIndex];

  const handleSwipe = (offset) => {
    if (offset > 50 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setDragDirection(-1);
    } else if (offset < -50 && currentIndex < masters.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setDragDirection(1);
    }
  };

  const handleSelect = () => {
    setSelectedMaster(currentMaster.id);
  };

  const handleConfirm = () => {
    if (selectedMaster) {
      localStorage.setItem('selected_master', selectedMaster);
      navigate('/home');
    }
  };

  return (
    <div 
      className="container" 
      style={{ 
        position: 'relative', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        padding: '2rem 1rem',
        overflow: 'hidden'
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ 
          fontSize: '2.5rem', 
          marginBottom: '1rem',
          textAlign: 'center'
        }}
      >
        타로 마스터를 선택하세요
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        style={{ 
          fontSize: '1rem', 
          color: '#aaa', 
          marginBottom: '2rem',
          textAlign: 'center'
        }}
      >
        좌우로 스와이프하여 마스터를 선택하세요
      </motion.p>

      {/* 스와이프 가능한 마스터 카드 */}
      <div style={{
        width: '100%',
        maxWidth: '500px',
        height: '550px',
        position: 'relative',
        marginBottom: '2rem',
        overflow: 'visible'
      }}>
        <AnimatePresence initial={false} custom={dragDirection}>
          <motion.div
            key={currentIndex}
            custom={dragDirection}
            initial={{ x: dragDirection > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: dragDirection > 0 ? -300 : 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset }) => handleSwipe(offset.x)}
            onClick={handleSelect}
            style={{
              position: 'absolute',
              width: '100%',
              cursor: 'pointer',
              border: selectedMaster === currentMaster.id ? '3px solid #ffd700' : '2px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '15px',
              padding: '1.5rem',
              background: 'rgba(255, 255, 255, 0.05)',
              transition: 'border 0.3s ease'
            }}
            whileTap={{ cursor: 'grabbing' }}
          >
            {selectedMaster === currentMaster.id && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  boxShadow: [
                    '0 0 10px rgba(255, 215, 0, 0.5)',
                    '0 0 25px rgba(255, 215, 0, 0.8)',
                    '0 0 10px rgba(255, 215, 0, 0.5)'
                  ]
                }}
                transition={{ 
                  boxShadow: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '15px',
                  pointerEvents: 'none',
                  zIndex: -1
                }}
              />
            )}

            <video
              src={currentMaster.video}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '220px',
                objectFit: 'cover',
                borderRadius: '10px',
                marginBottom: '1rem',
                pointerEvents: 'none'
              }}
            />

            <h2 style={{ 
              fontSize: '1.5rem', 
              color: '#ffd700', 
              marginBottom: '0.5rem',
              textAlign: 'center'
            }}>
              {currentMaster.title}
            </h2>

            <h3 style={{ 
              fontSize: '1.2rem', 
              marginBottom: '0.5rem',
              textAlign: 'center'
            }}>
              {currentMaster.name} ({currentMaster.nameEn})
            </h3>

            <p style={{ 
              fontSize: '0.9rem', 
              color: '#aaa', 
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              {currentMaster.style}
            </p>

            <p style={{ 
              fontSize: '0.85rem', 
              lineHeight: '1.5',
              marginBottom: '1rem'
            }}>
              {currentMaster.description}
            </p>

            <p style={{ 
              fontSize: '0.8rem', 
              color: '#ffd700',
              fontStyle: 'italic'
            }}>
              추천: {currentMaster.recommend}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 인디케이터 */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '2rem' 
      }}>
        {masters.map((_, index) => (
          <div
            key={index}
            style={{
              width: index === currentIndex ? '30px' : '10px',
              height: '10px',
              borderRadius: '5px',
              background: index === currentIndex ? '#ffd700' : 'rgba(255, 215, 0, 0.3)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={() => {
              setDragDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>

      {/* 선택 버튼 - 하단 고정 */}
      <AnimatePresence>
        {selectedMaster && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
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
              background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
              color: '#0f0c29',
              fontWeight: 'bold',
              padding: '1rem 3rem',
              fontSize: '1.2rem',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {masters.find(m => m.id === selectedMaster)?.name} 마스터 선택하기
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelectMaster;
