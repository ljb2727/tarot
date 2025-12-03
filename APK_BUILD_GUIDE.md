# 📱 Android APK 빌드 가이드

## ✅ 사전 준비 완료 항목

- ✅ Capacitor Android 프로젝트 설정 완료
- ✅ 웹앱 빌드 완료 (`dist` 폴더)
- ✅ Capacitor Sync 완료 (웹 파일 → Android)
- ✅ AdMob 플러그인 통합 완료
- ✅ AndroidManifest.xml 설정 완료
- ✅ 앱 이름: **Mystic Tarot**
- ✅ 패키지명: **com.tarot.mystic**
- ✅ AdMob Test ID 설정 완료

## 🎯 Android Studio로 APK 빌드하기

### 1단계: Android Studio 실행

1. **Android Studio를 실행**합니다
2. 시작 화면에서 **"Open"** 버튼을 클릭합니다
3. 다음 경로를 선택합니다:
   ```
   f:\antigravity\tarot\android
   ```
4. **"OK"** 버튼을 클릭합니다

### 2단계: Gradle Sync 완료 대기

- 프로젝트를 열면 자동으로 **Gradle Sync**가 시작됩니다
- 화면 하단의 "Build" 탭에서 진행 상황을 확인할 수 있습니다
- ⏱️ 첫 빌드는 **1-3분** 정도 걸릴 수 있습니다
- "BUILD SUCCESSFUL" 메시지가 나타나면 완료입니다

> ⚠️ **만약 오류가 발생하면:**
> - "File → Invalidate Caches / Restart" 실행
> - 재시작 후 다시 시도

### 3단계: APK 빌드

1. 상단 메뉴에서 **Build → Build Bundle(s) / APK(s) → Build APK(s)** 클릭
2. 하단에 빌드 진행 상황이 표시됩니다
3. ⏱️ **1-2분** 정도 소요됩니다
4. 빌드가 완료되면 우측 하단에 알림이 나타납니다:
   ```
   APK(s) generated successfully.
   locate | analyze
   ```
5. **"locate"** 링크를 클릭하면 APK 파일 위치가 열립니다

### 4단계: APK 파일 확인

APK 파일 위치:
```
C:\build\tarot-android\app\outputs\apk\debug\app-debug.apk
```

이 파일이 바로 **설치 가능한 Android APK 파일**입니다! 🎉

## 📦 APK 파일 테스트

### 방법 1: 실제 Android 기기에서 테스트

1. **USB 디버깅 활성화**
   - 설정 → 휴대전화 정보 → 빌드 번호 7번 탭 (개발자 모드 활성화)
   - 설정 → 개발자 옵션 → USB 디버깅 ON

2. **USB로 기기 연결**
   - Android Studio 상단의 기기 선택 드롭다운에서 기기 선택
   - 초록색 실행 버튼(▶) 클릭

3. **또는 APK 파일 직접 전송**
   - `app-debug.apk` 파일을 기기로 전송
   - 파일 매니저에서 APK 파일 클릭
   - "설치" 클릭 (출처를 알 수 없는 앱 설치 허용 필요)

### 방법 2: 에뮬레이터에서 테스트

1. Android Studio 상단 **Tools → Device Manager** 클릭
2. **Create Device** 버튼 클릭
3. 원하는 기기 선택 (예: Pixel 6)
4. API 레벨 선택 (API 30 이상 권장)
5. 다운로드 후 "Finish"
6. 에뮬레이터 시작 후 APK를 드래그 앤 드롭

## 🚀 플레이스토어 배포용 APK 빌드

현재 만든 `app-debug.apk`는 **테스트용**입니다. 
플레이스토어에 배포하려면 **Release APK (AAB)**를 만들어야 합니다.

### Release AAB 빌드 방법

1. **서명 키 생성**
   - Build → Generate Signed Bundle / APK 클릭
   - Android App Bundle 선택
   - "Create new..." 클릭하여 키스토어 생성
   - 정보 입력 (비밀번호는 안전하게 보관!)

2. **Release 빌드**
   - Build → Generate Signed Bundle / APK
   - Android App Bundle 선택
   - 방금 만든 키스토어 선택
   - Build Variant: **release** 선택
   - Finish

3. **AAB 파일 위치**
   ```
   C:\build\tarot-android\app\outputs\bundle\release\app-release.aab
   ```

4. **Google Play Console에 업로드**
   - [Google Play Console](https://play.google.com/console) 접속
   - 앱 만들기
   - `app-release.aab` 파일 업로드

## ⚠️ 실제 배포 전 체크리스트

- [ ] AdMob Test ID를 **실제 AdMob ID**로 변경
  - `AndroidManifest.xml` 파일의 `com.google.android.gms.ads.APPLICATION_ID` 수정
  - `src/utils/admob.js`의 광고 ID들 수정

- [ ] 앱 아이콘 커스터마이징
  - `android/app/src/main/res/mipmap-*` 폴더의 `ic_launcher.png` 교체

- [ ] 앱 이름 확인/변경
  - `android/app/src/main/res/values/strings.xml`

- [ ] 버전 코드/이름 업데이트
  - `android/app/build.gradle`의 `versionCode` 및 `versionName`

- [ ] API 키 보안 강화
  - Gemini API 키를 백엔드 서버로 이동 (권장)
  - 또는 Google Cloud Console에서 Android 앱 제한 설정

## 📞 문제 해결

### "BUILD FAILED" 오류 발생 시

1. **File → Invalidate Caches / Restart** 실행
2. **Tools → SDK Manager**에서 최신 SDK 확인/설치
3. Gradle 버전 확인 (`android/gradle/wrapper/gradle-wrapper.properties`)

### 앱이 실행되지 않을 때

1. **Logcat 확인** (Android Studio 하단 탭)
2. 에러 메시지 확인
3. `npx cap sync android` 다시 실행 후 재빌드

---

## 🎉 성공!

APK 빌드가 완료되면 Android 기기에서 **Mystic Tarot** 앱을 실행할 수 있습니다!

앱을 실행하면:
- ✨ 타로 카드 선택 기능
- 🤖 Gemini AI 타로 리딩
- 📱 AdMob 광고 (테스트 모드)

모두 정상 작동할 것입니다! 🎴✨
