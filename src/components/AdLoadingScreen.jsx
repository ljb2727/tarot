import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Capacitor } from '@capacitor/core';
import { showInterstitialAd } from '../utils/admob';
import '../styles/AdLoadingScreen.css';

const AdLoadingScreen = ({ onAdComplete, minDisplayTime = 5000 }) => {
  const [timeRemaining, setTimeRemaining] = useState(minDisplayTime / 1000);
  const [canSkip, setCanSkip] = useState(false);
  const [adShown, setAdShown] = useState(false);
  
  const isNativeApp = Capacitor.isNativePlatform();
  const isProduction = window.location.hostname !== 'localhost';

  // AdMob 전면광고 표시 (네이티브 앱)
  useEffect(() => {
    if (isNativeApp && !adShown) {
      const showAd = async () => {
        try {
          console.log('AdMob 전면광고 표시 시도...');
          await showInterstitialAd();
          setAdShown(true);
          console.log('AdMob 광고 표시 완료');
        } catch (e) {
          console.error('AdMob 광고 표시 실패:', e);
          setAdShown(true); // 에러가 나도 타이머는 진행
        }
      };
      
      showAd();
    }
  }, [isNativeApp, adShown]);

  // AdSense 광고 로드 (웹)
  useEffect(() => {
    if (!isNativeApp && isProduction) {
      const loadAd = setTimeout(() => {
        try {
          console.log('AdSense 초기화 시도...');
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log('AdSense 푸시 완료');
        } catch (e) {
          console.error('AdSense 오류:', e);
        }
      }, 500);

      return () => clearTimeout(loadAd);
    }
  }, [isNativeApp, isProduction]);

  // 최소 광고 시청 시간 타이머
  useEffect(() => {
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

    return () => clearInterval(timer);
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

        {/* 광고 영역 */}
        <div className="ad-space">
          {isNativeApp ? (
            // 네이티브 앱: AdMob 전면광고가 전체화면으로 표시됨
            <div className="ad-placeholder">
              <div className="placeholder-content">
                <p>📱 AdMob 광고</p>
                <p style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '0.5rem' }}>
                  전면광고가 별도 화면으로 표시됩니다
                </p>
              </div>
            </div>
          ) : isProduction ? (
            // 웹 프로덕션: AdSense
            <ins className="adsbygoogle"
                 style={{ 
                   display: 'block',
                   width: '100%',
                   minHeight: '280px'
                 }}
                 data-ad-client="ca-pub-3362637665990884"
                 data-ad-slot="4356489464"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          ) : (
            // 로컬 개발
            <div className="ad-placeholder">
              <div className="placeholder-content">
                <p>📺 광고 영역</p>
                <p style={{ fontSize: '0.9rem', color: '#aaa', marginTop: '0.5rem' }}>
                  실제 배포 환경에서 광고가 표시됩니다
                </p>
              </div>
            </div>
          )}
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
