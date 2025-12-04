import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Reading from './pages/Reading';
import Result from './pages/Result';
import { initializeAdMob } from './utils/admob';
import { StatusBar, Style } from '@capacitor/status-bar';

import Intro from './pages/Intro';
import SelectMaster from './pages/SelectMaster';

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
      root.style.setProperty('--color-primary', '#ff4d4d');
      root.style.setProperty('--color-secondary', '#c0392b');
      root.style.setProperty('--color-btn-gradient', 'linear-gradient(135deg, #ff4d4d 0%, #ff8080 100%)');
      root.style.setProperty('--color-shadow-primary', 'rgba(255, 77, 77, 0.4)');
    } else {
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
      initializeAdMob();
      
      try {
        await StatusBar.setOverlaysWebView({ overlay: false });
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#000000' });
      } catch (error) {
        console.log('StatusBar API not available (running in web browser)');
      }

      // ⬇⬇⬇ 하단 네비게이션바 침범 방지 핵심 부분 ⬇⬇⬇
      document.documentElement.style.setProperty(
        '--safe-bottom',
        'env(safe-area-inset-bottom)'
      );
      document.body.style.paddingBottom = 'env(safe-area-inset-bottom)';
      // ⬆⬆⬆ 여기만 추가하면 하단 안전영역 생김!!
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
