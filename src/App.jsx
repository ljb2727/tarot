import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App as CapApp } from '@capacitor/app';
import Home from './pages/Home';
import Reading from './pages/Reading';
import Result from './pages/Result';
import Intro from './pages/Intro';
import SelectMaster from './pages/SelectMaster';
import History from './pages/History';
import HistoryDetail from './pages/HistoryDetail';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import { initializeAdMob } from './utils/admob';

// 스크롤 최상단 이동 컴포넌트
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      root.scrollTo(0, 0);
    }
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

// 안드로이드 백 버튼 핸들러
function BackButtonHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const handler = CapApp.addListener('backButton', () => {
      // Intro 페이지나 Home 페이지에서 백 버튼 누르면 앱 종료 확인
      if (location.pathname === '/' || location.pathname === '/home') {
        if (window.confirm('앱을 종료하시겠습니까?')) {
          CapApp.exitApp();
        }
      } else {
        // 그 외 페이지에서는 뒤로가기
        navigate(-1);
      }
    });

    return () => {
      handler.remove();
    };
  }, [location.pathname, navigate]);

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
          // 필수: WebView가 상태바 위로 올라가지 않도록 설정
          await StatusBar.setOverlaysWebView({ overlay: false });
          // 필수: 상태바 배경을 검정으로 설정
          await StatusBar.setBackgroundColor({ color: '#000000' });
          // 선택: 상태바 아이콘/텍스트 색상 설정
          await StatusBar.setStyle({ style: Style.Dark });
        } catch (error) {
          console.error('StatusBar config failed', error);
        }
      }
    };
    
    initializeApp();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <ThemeController />
      <BackButtonHandler />
      <Header />
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/select-master" element={<SelectMaster />} />
        <Route path="/home" element={<Home />} />
        <Route path="/reading" element={<Reading />} />
        <Route path="/result" element={<Result />} />
        <Route path="/history" element={<History />} />
        <Route path="/history/:id" element={<HistoryDetail />} />
      </Routes>
      <BottomNav />
    </Router>
  );
}

export default App;
