import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageModal = ({ isOpen, onClose, imageSrc, altText, isReversed }) => {
  const baseUrl = import.meta.env.BASE_URL;
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000, // BottomNav보다 높게
          padding: '20px',
          paddingBottom: 'calc(80px + var(--safe-bottom))', // BottomNav + safe area
          cursor: 'pointer'
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()} // 이미지 클릭 시 닫히지 않도록
          style={{
            position: 'relative',
            maxWidth: '90%',
            maxHeight: '90%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <img
            src={imageSrc}
            alt={altText}
            style={{
              maxWidth: '100%',
              maxHeight: '70vh', // 높이 줄여서 버튼 공간 확보
              borderRadius: '15px',
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
              transform: isReversed ? 'rotate(180deg)' : 'none',
              objectFit: 'contain'
            }}
            onError={(e) => { e.target.src = `${baseUrl}cards/card_back.png`; }}
          />
          <button
            onClick={onClose}
            style={{
              marginTop: '1.5rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              color: '#fff',
              padding: '12px 32px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            닫기
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;
