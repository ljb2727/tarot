import { GoogleGenAI } from "@google/genai";
import { getZodiacSign } from "./zodiac";

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
  
  let zodiacSign = '';
  if (userInfo.birthdate && userInfo.birthdate.length === 8) {
    zodiacSign = getZodiacSign(userInfo.birthdate);
    userInfoText.push(`생년월일: ${userInfo.birthdate} (${zodiacSign})`);
  }
  
  if (userInfo.job) userInfoText.push(`직업: ${userInfo.job}`);
  if (userInfo.gender) userInfoText.push(`성별: ${userInfo.gender}`);
  
  const userInfoSection = userInfoText.length > 0 
    ? `\n사용자 정보:\n${userInfoText.join('\n')}\n\n이 정보를 바탕으로 더 구체적이고 개인화된 해석을 제공해주세요.\n특히 **${zodiacSign}**의 성향이나 현재 운세 흐름을 타로 카드 해석과 연결지어 설명해주세요.\n` 
    : '';

  // 선택된 마스터 확인
  const selectedMaster = localStorage.getItem('selected_master') || 'aria';
  
  let masterPrompt = '';
  if (selectedMaster === 'aria') {
    masterPrompt = `당신은 신비로운 타로 마스터 '아리아'입니다. 친절하고 따뜻한 말투로 내담자의 고민을 들어주고 타로 리딩을 해주세요.
제공된 '이미지 묘사'를 바탕으로 카드의 그림을 사용자에게 설명하듯 묘사하고 해석해주세요.
정확하고 담백하게, 감정에 치우치지 않고 카드가 가리키는 진실을 명확하게 전달해주세요.`;
  } else if (selectedMaster === 'calix') {
    masterPrompt = `당신은 냉철한 타로 마스터 '칼릭스'입니다. 직설적이고 현실적인 말투로 내담자가 외면하고 있던 진실을 거침없이 드러내주세요.
제공된 '이미지 묘사'를 바탕으로 카드의 그림을 날카롭게 분석하고 해석해주세요.
달콤한 환상은 깨트리고, 현실을 직시하게 만들어주세요. 당장 행동해야 할 것과 포기해야 할 것을 명확히 구분해주세요.
"~인 것 같아요", "~할 수도 있어요" 같은 모호한 표현 대신 "~입니다", "~해야 합니다" 같은 단정적 표현을 사용하세요.
필요하다면 쓴소리도 서슴지 마세요.`;
  }

  const prompt = `${masterPrompt}
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
    
    console.log('Gemini Response:', response); // 디버깅용 로그

    // 응답에서 텍스트 추출
    let text = '';
    if (typeof response.text === 'function') {
      try {
        text = response.text();
      } catch (e) {
        console.warn('response.text() 호출 실패:', e);
      }
    } 
    
    if (!text && response.text && typeof response.text === 'string') {
      text = response.text;
    } 
    
    if (!text && response.candidates?.length > 0) {
       // 구조가 다를 경우를 대비한 안전장치
       const candidate = response.candidates[0];
       if (candidate.content?.parts?.length > 0) {
         text = candidate.content.parts[0].text;
       }
    }
    
    if (!text) {
      throw new Error('API 응답에서 텍스트를 추출할 수 없습니다.');
    }

    // 구분선(---, ===, ***, ___ 등) 제거
    text = text.replace(/^\s*[-=*_]{3,}\s*$/gm, '');
    
    // 연속된 빈 줄을 하나로
    text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // 최종 공백 정리
    text = text.trim();
    
    return text;
  } catch (error) {
    console.error('Gemini API 오류:', error);
    throw new Error('AI 해석 생성 실패: ' + error.message);
  }
};
