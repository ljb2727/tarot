# 타로카드 웹앱 프로젝트 구조

## 📁 프로젝트 개요
React와 Vite를 사용한 신비로운 타로카드 점보기 웹 애플리케이션입니다.

## 🗂️ 폴더 구조

```
타로카드/
├── public/
│   └── cards/                  # 카드 이미지 폴더
│       ├── card_back.png       # 카드 뒷면 이미지
│       ├── major_0.png         # 메이저 아르카나 0번 (바보)
│       ├── major_1.png         # 메이저 아르카나 1번 (마법사)
│       ├── major_2.png         # 메이저 아르카나 2번 (여사제)
│       └── ...                 # 추가 카드 이미지 (78장)
│
├── src/
│   ├── components/             # 재사용 가능한 컴포넌트
│   │   ├── Card.jsx           # 카드 컴포넌트 (뒤집기 애니메이션 포함)
│   │   └── ApiKeyModal.jsx    # API 키 설정 모달
│   │
│   ├── pages/                  # 페이지 컴포넌트
│   │   ├── Home.jsx           # 홈 페이지
│   │   ├── Reading.jsx        # 카드 선택 페이지
│   │   └── Result.jsx         # 결과 페이지
│   │
│   ├── styles/                 # CSS 스타일
│   │   ├── index.css          # 전역 스타일
│   │   ├── Card.css           # 카드 컴포넌트 스타일
│   │   ├── Reading.css        # 리딩 페이지 스타일
│   │   ├── Result.css         # 결과 페이지 스타일
│   │   └── ApiKeyModal.css    # API 키 모달 스타일
│   │
│   ├── utils/                  # 유틸리티 함수
│   │   ├── tarot.js           # 타로 덱 관련 함수
│   │   └── gemini.js          # Gemini AI API 호출
│   │
│   ├── data/                   # 데이터 파일
│   │   └── card.json          # 타로 카드 정보 (78장)
│   │
│   ├── App.jsx                 # 메인 앱 컴포넌트 (라우팅)
│   └── main.jsx                # 앱 진입점
│
├── index.html                  # HTML 템플릿
├── package.json                # 프로젝트 의존성
└── vite.config.js             # Vite 설정

```

## 🎴 카드 데이터 구조

### card.json
- **메이저 아르카나**: 22장 (0-21)
- **마이너 아르카나**: 56장
  - Wands (지팡이): 14장
  - Cups (컵): 14장
  - Swords (검): 14장
  - Pentacles (펜타클): 14장

각 카드는 다음 정보를 포함합니다:
- `name_kr`: 한글 이름
- `name_en`: 영문 이름
- `image_prompt`: 이미지 생성 프롬프트
- `number`: 카드 번호

## 🛠️ 주요 기능

### 1. Home (홈 페이지)
- 앱 소개
- 타로 보기 버튼

### 2. Reading (리딩 페이지)
- 78장의 카드가 부채꼴로 펼쳐짐
- 사용자가 3장 선택 (과거, 현재, 미래)
- 카드는 뒷면으로 표시됨
- 선택된 카드 프리뷰 표시

### 3. Result (결과 페이지)
- 선택한 3장의 카드가 순차적으로 뒤집힘
- **🤖 AI 타로 리딩**: Gemini 2.0 Flash를 사용한 전문적인 타로 해석
- 각 카드의 의미와 종합 조언
- 다시 하기 버튼
- API 키 설정 기능

## 🤖 AI 타로 리딩 기능

### Gemini API 통합
- **모델**: gemini-2.5-flash
- **기능**: 전문 타로 상담사처럼 3장의 카드를 스토리텔링 형식으로 해석
- **특징**:
  - 과거-현재-미래를 하나의 흐름으로 연결
  - 따뜻하고 신뢰감 있는 어조
  - 구체적인 행동 조언 제공
  - 운명론적 단정 배제

### API 키 설정 방법
1. [Google AI Studio](https://ai.google.dev/gemini-api/docs?hl=ko)에서 API 키 발급
2. 결과 페이지에서 "⚙️ API 키 설정" 버튼 클릭
3. API 키 입력 후 저장 (로컬 스토리지에 안전하게 보관)
4. "🤖 AI 타로 리딩 받기" 버튼으로 AI 해석 생성

## 🎨 디자인 특징

- **색상 테마**: 어두운 보라색 그라데이션 배경
- **폰트**: 
  - 본문: Inter (Google Fonts)
  - 제목: Playfair Display (Google Fonts)
- **애니메이션**: Framer Motion을 사용한 부드러운 전환
- **카드 효과**: 3D 뒤집기 애니메이션
- **AI 버튼**: 보라색 그라데이션 글로우 효과

## 📦 설치된 패키지

- `react`: UI 라이브러리
- `react-dom`: React DOM 렌더링
- `react-router-dom`: 페이지 라우팅
- `framer-motion`: 애니메이션 라이브러리
- `@google/generative-ai`: Gemini AI API
- `vite`: 빌드 도구

## 🚀 실행 방법

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프리뷰
npm run preview
```

## 📝 완료 및 향후 개선 사항

✅ **완료된 기능:**
1. ✅ 메이저 아르카나 3장 이미지 생성
2. ✅ 카드 선택 및 뒤집기 애니메이션
3. ✅ Gemini AI 타로 해석 기능
4. ✅ API 키 관리 시스템
5. ✅ 선택된 카드 프리뷰

⏳ **향후 개선 사항:**
1. 나머지 75장 카드 이미지 생성
2. 다양한 스프레드 방식 추가 (5장, 켈틱 크로스 등)
3. 카드 정방향/역방향 리딩
4. 리딩 결과 저장 및 히스토리
5. 사용자 질문 입력 기능
