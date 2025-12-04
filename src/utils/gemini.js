import { GoogleGenAI } from "@google/genai";

export const generateTarotReading = async (cards, apiKey, question, userInfo = {}) => {
  if (!apiKey) {
    throw new Error('API 키가 필요합니다.');
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const card1 = cards[0];
  const card2 = cards[1];
  const card3 = cards[2];

  // 사용자 정보 문자열 생성
  const userInfoText = [];
  if (userInfo.name) userInfoText.push(`이름: ${userInfo.name}`);
  if (userInfo.age) userInfoText.push(`나이: ${userInfo.age}세`);
  if (userInfo.job) userInfoText.push(`직업: ${userInfo.job}`);
  if (userInfo.gender) userInfoText.push(`성별: ${userInfo.gender}`);
  
  const userInfoSection = userInfoText.length > 0 
    ? `\n사용자 정보:\n${userInfoText.join('\n')}\n\n이 정보를 바탕으로 더 구체적이고 개인화된 해석을 제공해주세요.\n` 
    : '';

  const prompt = `당신은 타로 전문가입니다. 다음 질문에 대해 타로 리딩을 해주세요.
제공된 '이미지 묘사'를 바탕으로 카드의 그림을 사용자에게 설명하듯 묘사하고 해석해주세요.
${userInfoSection}
질문: ${question}

뽑은 카드:
1. 과거 - ${card1.name_kr} (${card1.isReversed ? '역방향' : '정방향'})
   이미지 묘사: ${card1.image_description}
   의미: ${card1.isReversed ? card1.meaning_reversed : card1.meaning_upright}

2. 현재 - ${card2.name_kr} (${card2.isReversed ? '역방향' : '정방향'})
   이미지 묘사: ${card2.image_description}
   의미: ${card2.isReversed ? card2.meaning_reversed : card2.meaning_upright}

3. 미래 - ${card3.name_kr} (${card3.isReversed ? '역방향' : '정방향'})
   이미지 묘사: ${card3.image_description}
   의미: ${card3.isReversed ? card3.meaning_reversed : card3.meaning_upright}

답변 가이드라인:
1. 각 카드 해석 시, **제공된 이미지 묘사를 활용하여** 카드의 그림을 생생하게 설명해주세요. (예: "이 카드에는 [이미지 묘사 내용]이 그려져 있습니다.")
2. 그 그림이 사용자님의 상황과 어떻게 연결되는지 **공감하며 설명**해주세요.
3. 핵심 키워드는 **볼드**로 표시해주세요.
4. 답변 형식은 다음과 같이 해주세요:

🃏 **과거: ${card1.name_kr}**
(이미지 묘사 및 공감 해석)

🃏 **현재: ${card2.name_kr}**
(이미지 묘사 및 공감 해석)

🃏 **미래: ${card3.name_kr}**
(이미지 묘사 및 공감 해석)

### 과거-현재-미래 종합 해석
(전체 흐름 요약)

🌟 **종합 조언**
(구체적인 조언)`;

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
