import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ApiKeyModal.css';

const ApiKeyModal = ({ isOpen, onClose, onSave }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('gemini_api_key');
      if (savedKey) {
        setApiKey(savedKey);
      }
    } catch (error) {
      console.warn('localStorage 접근 불가:', error);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (apiKey.trim()) {
      try {
        localStorage.setItem('gemini_api_key', apiKey.trim());
        onSave(apiKey.trim());
        onClose();
      } catch (error) {
        console.error('localStorage 저장 실패:', error);
        alert('API 키 저장에 실패했습니다. 브라우저 설정을 확인해주세요.');
      }
    } else {
      alert('API 키를 입력해주세요.');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>🔑 Gemini API 키 설정</h2>
          <p className="modal-description">
            AI 타로 리딩을 사용하려면 Google Gemini API 키가 필요합니다.
          </p>
          <a 
            href="https://ai.google.dev/gemini-api/docs?hl=ko" 
            target="_blank" 
            rel="noopener noreferrer"
            className="api-link"
          >
            API 키 발급받기 →
          </a>
          <input
            type="password"
            placeholder="API 키를 입력하세요"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="api-input"
          />
          <div className="modal-buttons">
            <button onClick={handleSave} className="btn-save">
              저장
            </button>
            <button onClick={onClose} className="btn-cancel">
              취소
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApiKeyModal;
