import { GoogleGenAI } from "@google/genai";

export const generateTarotReading = async (cards, apiKey, question) => {
  if (!apiKey) {
    throw new Error('API 키가 필요합니다.');
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const card1 = cards[0];
  const card2 = cards[1];
  const card3 = cards[2];

  const prompt = `당신은 타로 전문가입니다. 다음 질문에 대해 타로 리딩을 해주세요.

질문: ${question}

뽑은 카드:
1. 과거 - ${card1.name_kr} (${card1.isReversed ? '역방향' : '정방향'})
   의미: ${card1.isReversed ? card1.meaning_reversed : card1.meaning_upright}

2. 현재 - ${card2.name_kr} (${card2.isReversed ? '역방향' : '정방향'})
   의미: ${card2.isReversed ? card2.meaning_reversed : card2.meaning_upright}

3. 미래 - ${card3.name_kr} (${card3.isReversed ? '역방향' : '정방향'})
   의미: ${card3.isReversed ? card3.meaning_reversed : card3.meaning_upright}

위 카드들의 의미를 바탕으로 과거-현재-미래 해석과 조언을 해주세요.
핵심 키워드는 **볼드**로 표시해주세요.`;

  try {
    // @google/genai 패키지 사용법에 맞게 수정
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error('Gemini API 오류:', error);
    throw new Error('AI 해석 생성 실패: ' + error.message);
  }
};
