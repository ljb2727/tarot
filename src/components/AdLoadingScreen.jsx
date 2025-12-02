import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/AdLoadingScreen.css';

const AdLoadingScreen = ({ onAdComplete, minDisplayTime = 5000 }) => {
  const [timeRemaining, setTimeRemaining] = useState(minDisplayTime / 1000);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    // 광고 스크립트 로드 - DOM이 완전히 렌더링된 후 실행
    const loadAd = setTimeout(() => {
      try {
        if (window.adsbygoogle && window.adsbygoogle.loaded !== true) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }, 100); // 100ms 대기 후 광고 로드

    // 최소 광고 시청 시간 타이머
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setCanSkip(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(loadAd);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="ad-loading-screen">
      <div className="ad-container">
        <motion.div
          className="ad-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>🔮 운세 해석 중...</h2>
          <p>잠시만 기다려주세요</p>
        </motion.div>

        {/* AdSense 광고 영역 */}
        <div className="ad-space">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-3362637665990884"
               data-ad-slot="8519136349"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>

        {/* 진행 바 */}
        <div className="timer-section">
          {!canSkip ? (
            <>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: minDisplayTime / 1000, ease: 'linear' }}
                />
              </div>
              <p className="timer-text">
                결과 준비 중... {timeRemaining}초
              </p>
            </>
          ) : (
            <motion.button
              className="btn-view-result"
              onClick={onAdComplete}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ✨ 결과 확인하기
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdLoadingScreen;
