import { GoogleGenAI } from "@google/genai";

export const generateTarotReading = async (cards, apiKey, question) => {
  if (!apiKey) {
    throw new Error('API 키가 필요합니다.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const cardDescriptions = cards.map((card, index) => 
    `${positions[index]}: ${card.name_kr} (${card.name_en}) ${card.isReversed ? '- [역방향]' : '- [정방향]'}`
  ).join('\n');

  const prompt = `
🤖 AI 타로 리더로서 다음 질문에 대해 3장의 카드를 해석해주세요.

질문: "${question}"

페르소나:
- 역할: 공감 능력이 뛰어나고 직관적인 전문 타로 상담사
- 어조: 따뜻하고 부드러우며 신뢰감을 주는 존댓말
- 태도: 스토리텔링 형식으로 답변, 질문자의 고민에 집중

선택된 카드:
${cardDescriptions}

스프레드: 과거-현재-미래

역방향(Reversed) 해석 규칙:
만약 카드가 '[역방향]'이라면, 다음 3가지 관점 중 상황에 가장 적절한 것으로 해석하세요:
1. Blocked (막힘): 긍정적인 에너지가 흐르지 못하고 정체된 상태.
2. Opposite (반대): 정방향의 의미가 뒤집힘 (예: 성공 → 실패, 사랑 → 다툼).
3. Internal (내면): 겉으로 드러나지 않고 속으로만 고민하는 상태.
* 주의: 역방향이라고 해서 무조건 부정적으로 해석하지 말고, '조언'이나 '주의할 점'으로 부드럽게 풀어서 설명하세요.

답변 형식:
### 🔮 당신의 타로 리딩 결과

**질문: ${question}**

**1. 과거: ${cards[0].name_kr} ${cards[0].isReversed ? '(역방향)' : ''}**
(이 카드의 이미지와 상징을 시각적으로 묘사하고, 질문과 관련하여 과거에 무슨 일이 있었는지 해석. 역방향일 경우 위 규칙 적용)

**2. 현재: ${cards[1].name_kr} ${cards[1].isReversed ? '(역방향)' : ''}**
(현재 상황과 이 카드의 의미, 질문자의 현재 상태. 역방향일 경우 위 규칙 적용)

**3. 미래: ${cards[2].name_kr} ${cards[2].isReversed ? '(역방향)' : ''}**
(앞으로의 흐름과 결과 예측. 역방향일 경우 위 규칙 적용)

**4. 종합 조언 💫**
(세 장의 카드를 하나의 이야기로 연결하고, 질문에 대한 구체적인 해결책과 조언 제시)

주의사항:
- 운명론적 단정 금지
- 긍정적이고 건설적인 조언
- 3-4개의 문단으로 구성
- 각 카드를 따로따로가 아닌 하나의 흐름으로 연결하여 질문에 대한 답을 줄 것
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Gemini API 오류:', error);
    throw new Error('AI 해석을 생성하는 중 오류가 발생했습니다.');
  }
};
