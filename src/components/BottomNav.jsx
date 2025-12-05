import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Intro 페이지에서는 네비 숨김
  if (location.pathname === '/') {
    return null;
  }

  const navItems = [
    { path: '/home', icon: '🏠', label: '홈' },
    { path: '/reading', icon: '🔮', label: '타로' },
    { path: '/history', icon: '📚', label: '보관함' }
  ];

  return (
    <motion.nav
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: 'var(--safe-bottom)',
        background: 'linear-gradient(to top, rgba(15, 12, 41, 0.95), rgba(15, 12, 41, 0.8))',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 215, 0, 0.2)',
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div style={{
        height: '55px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 0.5rem'
      }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(item.path)}
              style={{
                background: 'transparent',
                border: 'none',
                color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.15rem',
                padding: '0.3rem 0.75rem',
                transition: 'all 0.3s',
                borderRadius: '10px',
                minWidth: '55px'
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
              <span style={{ 
                fontSize: '0.65rem',
                fontWeight: isActive ? 'bold' : 'normal'
              }}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};

export default BottomNav;
