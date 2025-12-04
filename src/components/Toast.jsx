import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 107, 107, 0.9)', // 연한 빨간색 (파스텔 톤)
            color: 'white',
            padding: '12px 24px',
            borderRadius: '25px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
            zIndex: 9999,
            fontSize: '0.95rem',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          ⚠️ {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
