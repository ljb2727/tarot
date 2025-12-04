import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Reading from './pages/Reading';
import Result from './pages/Result';
import { initializeAdMob } from './utils/admob';

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

function App() {
  useEffect(() => {
    initializeAdMob();
  }, []);

  return (
    <Router>
      <ScrollToTop />
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
