import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import Home from './pages/Home';
import Reading from './pages/Reading';
import Result from './pages/Result';
import Intro from './pages/Intro';
import SelectMaster from './pages/SelectMaster';
import { initializeAdMob } from './utils/admob';

// 스크롤 최상단 이동 컴포넌트
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// 테마 관리 컴포넌트
function ThemeController() {
  const { pathname } = useLocation();

  useEffect(() => {
    const selectedMaster = localStorage.getItem('selected_master') || 'aria';
    const root = document.documentElement;

    if (selectedMaster === 'calix') {
      // 칼릭스 테마 (레드)
      root.style.setProperty('--color-primary', '#ff4d4d');
      root.style.setProperty('--color-secondary', '#c0392b');
      root.style.setProperty('--color-btn-gradient', 'linear-gradient(135deg, #ff4d4d 0%, #ff8080 100%)');
      root.style.setProperty('--color-shadow-primary', 'rgba(255, 77, 77, 0.4)');
    } else {
      // 아리아 테마 (골드 - 기본)
      root.style.setProperty('--color-primary', '#ffd700');
      root.style.setProperty('--color-secondary', '#9b59b6');
      root.style.setProperty('--color-btn-gradient', 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)');
      root.style.setProperty('--color-shadow-primary', 'rgba(255, 215, 0, 0.4)');
    }
  }, [pathname]);

  return null;
}

function App() {
  useEffect(() => {
    const initializeApp = async () => {
      // AdMob 초기화
      initializeAdMob();
      
      // StatusBar 설정 (Capacitor 7 대응)
      if (Capacitor.isNativePlatform()) {
        try {
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#000000' });
          await StatusBar.setOverlaysWebView({ overlay: false });
        } catch (error) {
          console.log('StatusBar error:', error);
        }
      }
    };
    
    initializeApp();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <ThemeController />
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/select-master" element={<SelectMaster />} />
        <Route path="/home" element={<Home />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;
