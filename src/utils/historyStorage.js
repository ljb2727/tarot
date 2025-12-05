const HISTORY_KEY = 'tarot_history';
const MAX_HISTORY = 100;

/**
 * 타로 결과를 히스토리에 저장
 * @param {Object} result - 저장할 타로 결과
 * @param {string} result.question - 질문
 * @param {Object} result.userInfo - 사용자 정보
 * @param {Array} result.cards - 선택된 카드들
 * @param {string} result.aiReading - AI 해석 결과
 * @param {string} result.selectedMaster - 선택된 마스터
 */
export const saveHistory = (result) => {
  try {
    const history = getHistory();
    
    // 새 결과 생성
    const newResult = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      question: result.question,
      userInfo: result.userInfo,
      cards: result.cards,
      aiReading: result.aiReading,
      selectedMaster: result.selectedMaster || localStorage.getItem('selected_master') || 'aria'
    };

    // 배열 맨 앞에 추가 (최신순)
    history.unshift(newResult);

    // 최대 개수 제한 (오래된 것 삭제)
    if (history.length > MAX_HISTORY) {
      history.splice(MAX_HISTORY);
    }

    // 저장
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    
    return true;
  } catch (error) {
    console.error('히스토리 저장 실패:', error);
    return false;
  }
};

/**
 * 전체 히스토리 가져오기
 * @returns {Array} 히스토리 배열
 */
export const getHistory = () => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('히스토리 불러오기 실패:', error);
    return [];
  }
};

/**
 * 특정 히스토리 아이템 가져오기
 * @param {string} id - 히스토리 ID
 * @returns {Object|null} 히스토리 아이템
 */
export const getHistoryById = (id) => {
  try {
    const history = getHistory();
    return history.find(item => item.id === id) || null;
  } catch (error) {
    console.error('히스토리 아이템 조회 실패:', error);
    return null;
  }
};

/**
 * 특정 히스토리 삭제
 * @param {string} id - 삭제할 히스토리 ID
 */
export const deleteHistory = (id) => {
  try {
    const history = getHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('히스토리 삭제 실패:', error);
    return false;
  }
};

/**
 * 전체 히스토리 삭제
 */
export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('히스토리 전체 삭제 실패:', error);
    return false;
  }
};

/**
 * 히스토리 개수 가져오기
 * @returns {number} 저장된 히스토리 개수
 */
export const getHistoryCount = () => {
  return getHistory().length;
};
