import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageModal = ({ isOpen, onClose, imageSrc, altText, isReversed }) => {
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
          zIndex: 1000,
          padding: '20px',
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
              maxHeight: '80vh',
              borderRadius: '15px',
              boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
              transform: isReversed ? 'rotate(180deg)' : 'none',
              objectFit: 'contain'
            }}
            onError={(e) => { e.target.src = '/cards/card_back.png'; }}
          />
          <button
            onClick={onClose}
            style={{
              marginTop: '1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              padding: '8px 24px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'background 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            닫기
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;
