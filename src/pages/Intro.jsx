import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Intro = () => {
  const navigate = useNavigate();



  return (
    <div 
      className="container" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        cursor: 'pointer'
      }}
      onClick={() => navigate('/select-master')}
    >
      <motion.h1 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ fontSize: '4rem', marginBottom: '1rem' }}
      >
        원픽 타로
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        style={{ fontSize: '1.5rem', marginBottom: '3rem', maxWidth: '600px', lineHeight: '1.6' }}
      >
        당신의 운명을 확인해보세요. <br />카드가 당신에게 들려줄 이야기가 있습니다.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#aaa' }}
      >
        화면을 터치하면 시작합니다
      </motion.div>
    </div>
  );
};

export default Intro;
