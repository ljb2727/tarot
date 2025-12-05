import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Intro 페이지에서는 헤더 숨김
  if (location.pathname === '/') {
    return null;
  }

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 'env(safe-area-inset-top)',
        background: 'linear-gradient(to bottom, rgba(15, 12, 41, 0.95), rgba(15, 12, 41, 0.8))',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem'
      }}>
        {/* 뒤로가기 버튼 */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          ←
        </motion.button>

        {/* 타이틀 */}
        <h1 style={{
          margin: 0,
          fontSize: '1.2rem',
          color: '#fff',
          fontFamily: 'var(--font-serif)',
          textAlign: 'center',
          flex: 1
        }}>
          원픽 타로
        </h1>

        {/* 오른쪽 공간 (대칭을 위해) */}
        <div style={{ width: '40px' }}></div>
      </div>
    </motion.header>
  );
};

export default Header;
