import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getHistory, deleteHistory, clearHistory } from '../utils/historyStorage';
import '../styles/History.css';

const History = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = getHistory();
    setHistory(data);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return '오늘';
    if (days === 1) return '어제';
    if (days < 7) return `${days}일 전`;
    
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('이 운세를 삭제하시겠습니까?')) {
      deleteHistory(id);
      loadHistory();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('모든 운세 기록을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      clearHistory();
      loadHistory();
      setShowDeleteConfirm(false);
    }
  };

  const handleItemClick = (id) => {
    navigate(`/history/${id}`);
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <h1>나의 운세 보관함</h1>
        <p className="history-count">총 {history.length}개의 기록</p>
        {history.length > 0 && (
          <button 
            className="btn-clear-all"
            onClick={() => setShowDeleteConfirm(true)}
          >
            전체 삭제
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔮</div>
          <p>아직 저장된 운세가 없습니다</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/home')}
            style={{ marginTop: '1rem' }}
          >
            타로 보러 가기
          </button>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              className="history-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleItemClick(item.id)}
            >
              <div className="history-item-header">
                <span className="history-date">{formatDate(item.date)}</span>
                <span className="history-master">
                  {item.selectedMaster === 'calix' ? '칼릭스' : '아리아'}
                </span>
              </div>
              <div className="history-question">
                Q. {item.question}
              </div>
              <div className="history-cards">
                {item.cards.map((card, idx) => (
                  <span key={idx} className="history-card-name">
                    {card.name_kr}
                    {card.isReversed && ' (역)'}
                  </span>
                ))}
              </div>
              <button
                className="btn-delete-item"
                onClick={(e) => handleDelete(e, item.id)}
              >
                🗑️
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>전체 삭제</h3>
            <p>모든 운세 기록을 삭제하시겠습니까?</p>
            <p style={{ fontSize: '0.9rem', color: '#999' }}>이 작업은 되돌릴 수 없습니다.</p>
            <div className="modal-buttons">
              <button 
                className="btn-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                취소
              </button>
              <button 
                className="btn-confirm"
                onClick={handleClearAll}
              >
                삭제
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default History;
