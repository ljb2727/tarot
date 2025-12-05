import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Intro = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // #root 요소의 패딩을 강제로 제거하여 전체 화면 사용
    const root = document.getElementById('root');
    if (root) {
      root.style.setProperty('padding-top', '0', 'important');
      root.style.setProperty('padding-bottom', '0', 'important');
    }

    return () => {
      document.body.style.overflow = 'auto';
      // 패딩 복구
      if (root) {
        root.style.removeProperty('padding-top');
        root.style.removeProperty('padding-bottom');
      }
    };
  }, []);

  return (
    <div 
      className="container" 
      style={{ 
        position: 'relative',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100dvh', // minHeight 대신 height로 고정
        width: '100vw',
        cursor: 'pointer',
        overflow: 'hidden',
        padding: 0,
        margin: 0
      }}
      onClick={() => navigate('/select-master')}
    >
      {/* 배경 비디오 */}
      <video
        src="images/intro.mp4"
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={(e) => {
          e.target.style.opacity = 1;
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0, // 초기 투명도 0
          transition: 'opacity 0.5s ease-in-out' // 부드러운 전환
        }}
      />

      {/* 어두운 오버레이 제거됨 */}

      {/* 콘텐츠 */}
      <div style={{ 
        position: 'relative', 
        zIndex: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'flex-end', // 하단 정렬
        width: '100%',
        height: '100%',
        paddingBottom: '25%' // 텍스트 위치 위로 올림
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
          style={{ 
            fontSize: '1.2rem', 
            color: '#fff', 
            fontWeight: 'bold',
            textShadow: '0 2px 10px rgba(0,0,0,0.7)',
            letterSpacing: '2px'
          }}
        >
          화면을 터치하면 시작합니다
        </motion.div>
      </div>
    </div>
  );
};

export default Intro;
