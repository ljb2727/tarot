# 🚀 Quick Start Guide

## 빠른 빌드 명령어

### 1. 웹앱 개발 서버 실행
```bash
npm run dev
```
→ http://localhost:5173

### 2. 웹앱 빌드
```bash
npm run build
```
→ `dist` 폴더 생성

### 3. Android 동기화
```bash
npx cap sync android
```
→ 웹 파일을 Android 프로젝트로 복사

### 4. Android Studio로 APK 빌드
1. Android Studio 실행
2. Open → `f:\antigravity\tarot\android`
3. Build → Build APK(s)

## 📁 주요 파일 위치

| 파일 | 경로 |
|------|------|
| 웹 소스코드 | `src/` |
| 타로 카드 데이터 | `src/data/card.json` |
| Gemini AI 설정 | `src/utils/gemini.js` |
| AdMob 설정 | `src/utils/admob.js` |
| Android 프로젝트 | `android/` |
| 앱 이름 설정 | `android/app/src/main/res/values/strings.xml` |
| AdMob App ID | `android/app/src/main/AndroidManifest.xml` |
| 생성된 APK | `android/app/build/outputs/apk/debug/app-debug.apk` |

## 🔑 API 키 설정

### Gemini API
- 발급: https://ai.google.dev/gemini-api/docs
- 사용: 앱 실행 후 "⚙️ API 키 설정" 버튼으로 입력

### AdMob (실제 배포 시)
1. [AdMob 콘솔](https://apps.admob.com/) 접속
2. 앱 등록 및 광고 단위 생성
3. `AndroidManifest.xml` 및 `admob.js`의 테스트 ID를 실제 ID로 교체

## 🛠️ 문제 해결

### 개발 서버 오류
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Android Sync 오류
```bash
npx cap sync android --no-build
```

### Gradle 오류
- Android Studio → File → Invalidate Caches / Restart

## 📱 테스트 방법

### 웹 브라우저
```bash
npm run dev
```

### Android 기기
1. USB 디버깅 활성화
2. Android Studio에서 기기 선택 후 실행(▶)

### Android 에뮬레이터
1. Tools → Device Manager → Create Device
2. APK를 에뮬레이터로 드래그 앤 드롭

---

더 자세한 내용은 [`APK_BUILD_GUIDE.md`](APK_BUILD_GUIDE.md) 참조
