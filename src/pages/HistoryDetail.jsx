import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getHistoryById, deleteHistory } from '../utils/historyStorage';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import html2canvas from 'html2canvas';
import Card from '../components/Card';
import '../styles/Result.css'; // Result 페이지와 동일한 스타일 사용

const HistoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [historyItem, setHistoryItem] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const item = getHistoryById(id);
    if (!item) {
      alert('해당 기록을 찾을 수 없습니다.');
      navigate('/history');
      return;
    }
    setHistoryItem(item);
  }, [id, navigate]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const handleDelete = () => {
    if (window.confirm('이 운세 기록을 삭제하시겠습니까?')) {
      deleteHistory(id);
      navigate('/history');
    }
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);

    try {
      const element = document.querySelector('.result-container');
      if (!element) throw new Error('캡처할 요소를 찾을 수 없습니다.');

      const canvas = await html2canvas(element, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#1a1a2e',
        logging: false,
        height: element.scrollHeight,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          const cardInners = clonedDoc.querySelectorAll('.card-inner');
          cardInners.forEach(inner => {
            inner.style.transform = 'none';
            inner.style.transition = 'none';
          });

          const cardFronts = clonedDoc.querySelectorAll('.card-front');
          cardFronts.forEach(front => {
            front.style.transform = 'none';
            front.style.zIndex = '10';
          });

          const cardBacks = clonedDoc.querySelectorAll('.card-back');
          cardBacks.forEach(back => {
            back.style.display = 'none';
          });
        }
      });

      const base64Data = canvas.toDataURL('image/jpeg', 0.8);
      const data = base64Data.split(',')[1];
      const fileName = `tarot_history_${Date.now()}.jpg`;

      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: data,
        directory: Directory.Cache
      });

      await Share.share({
        title: '원픽 타로 결과',
        text: `Q. ${historyItem.question}\n\n이미지로 결과를 확인해보세요!`,
        url: savedFile.uri,
        dialogTitle: '타로 결과 공유하기',
      });

    } catch (error) {
      console.error('공유 실패:', error);
      alert('결과 공유 중 오류가 발생했습니다.');
    } finally {
      setIsSharing(false);
    }
  };

  if (!historyItem) {
    return <div className="loading">불러오는 중...</div>;
  }

  const positions = ['과거', '현재', '미래'];

  return (
    <div className="container result-container">
      <div className="history-detail-header">
        <span className="history-detail-date">{formatDate(historyItem.date)}</span>
      </div>

      <div className="question-display" style={{ margin: '0 auto 2rem auto' }}>
        <span className="question-label">Q.</span>
        <span className="question-text">{historyItem.question}</span>
      </div>

      <h2 style={{ color: '#fff' }}>당신의 운명</h2>

      <div className="selected-cards-display">
        {historyItem.cards.map((card, index) => (
          <div key={card.id} className="selected-card-item">
            <span className="card-position-label">{positions[index]}</span>
            <Card 
              card={card}
              isFlipped={true}
              style={{ width: '100px', height: '166px' }}
            />
            <p className="selected-card-name" style={{ color: '#fff', maxWidth: '100px', wordWrap: 'break-word', textAlign: 'center' }}>
              {card.name_kr}
              {card.isReversed && <span className="reversed-badge">역</span>}
            </p>
          </div>
        ))}
      </div>

      <div className="ai-reading-section">
        <div className="loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2rem 0' }}>
          <motion.video
            src={historyItem.selectedMaster === 'calix' ? 'images/calix.mp4' : 'images/aria.mp4'}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={(e) => {
              e.target.style.opacity = 1;
            }}
            style={{
              width: '100%',
              maxWidth: '300px',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '50%',
              border: '4px solid var(--color-primary)',
              opacity: 0,
              transition: 'opacity 0.5s ease-in-out',
              marginBottom: '1rem',
              boxShadow: '0 0 40px var(--color-primary), 0 0 80px var(--color-shadow-primary), 0 0 120px var(--color-shadow-primary)'
            }}
          />
          <motion.p
            style={{ color: 'var(--color-primary)', fontSize: '1.1rem', fontWeight: 'bold', textAlign: 'center' }}
          >
            {historyItem.selectedMaster === 'calix'
              ? '칼릭스가 당신에게 전했던 직설적인 조언입니다.'
              : '아리아가 당신에게 전했던 운명의 메시지입니다.'}
          </motion.p>
        </div>

        <motion.div
          className="ai-reading-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ color: '#fff', whiteSpace: 'pre-wrap', lineHeight: '1.8' }}
        >
          {historyItem.aiReading}
        </motion.div>
      </div>

      <div className="action-buttons" style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        gap: '0.8rem', 
        justifyContent: 'center',
        width: '100%',
        maxWidth: '500px',
        padding: '0 1rem',
        marginTop: '2rem',
        marginBottom: '6rem'
      }}>
        <button 
          className="btn-primary" 
          onClick={handleShare}
          disabled={isSharing}
          style={{
            flex: 1,
            background: isSharing ? '#666' : 'var(--color-btn-gradient)',
            border: 'none',
            color: '#0f0c29',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            padding: '1rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            borderRadius: '15px',
            boxShadow: '0 4px 15px var(--color-shadow-primary)',
            opacity: isSharing ? 0.7 : 1
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>{isSharing ? '⏳' : '📤'}</span>
          {isSharing ? '저장중...' : '공유하기'}
        </button>

        <button 
          className="btn-primary" 
          onClick={handleDelete}
          style={{
            flex: 1,
            background: 'transparent',
            border: '2px solid #ff4d4d',
            color: '#ff4d4d',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            padding: '1rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            borderRadius: '15px',
            boxShadow: 'none'
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>🗑️</span>
          삭제하기
        </button>
      </div>
    </div>
  );
};

export default HistoryDetail;
