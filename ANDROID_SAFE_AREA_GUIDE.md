# Android Safe Area & System Bar Configuration Guide

이 문서는 Android 앱 빌드 시 **기기의 상태바(Status Bar)와 하단 네비게이션 바(Navigation Bar)를 침범하지 않고**, 안전한 영역(Safe Area) 내에 앱을 표시하기 위한 **검증된 설정**을 기록합니다.

---

## 1. Capacitor 로직 설정 (`src/App.jsx`)

앱 초기화 시점에 상태바가 웹뷰를 덮지 않도록 설정하고, 배경색을 검은색으로 고정합니다.

```javascript
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

// ... useEffect 내부 ...
if (Capacitor.isNativePlatform()) {
  try {
    // 필수: WebView가 상태바 위로 올라가지 않도록 설정 (Overlay 방지)
    await StatusBar.setOverlaysWebView({ overlay: false });
    
    // 필수: 상태바 배경을 완전한 검정색으로 설정
    await StatusBar.setBackgroundColor({ color: '#000000' });
    
    // 선택: 아이콘 색상 (Dark 모드 등)
    await StatusBar.setStyle({ style: Style.Dark });
  } catch (error) {
    console.error('StatusBar config failed', error);
  }
}
```

---

## 2. HTML Meta 태그 (`index.html`)

CSS `env()` 변수를 활성화하기 위해 `viewport-fit=cover`가 필수입니다.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

---

## 3. 전역 CSS 설정 (`src/styles/index.css`)

`:root` 변수로 안전 영역 값을 받고, `#root` 컨테이너에 패딩을 적용하여 스크롤 영역을 확보합니다.

```css
:root {
  /* 안전 영역 변수 선언 */
  --safe-top: env(safe-area-inset-top);
  --safe-bottom: env(safe-area-inset-bottom);
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: #000; /* 시스템 바와 일체감을 주는 배경색 */
  overflow: hidden; /* 스크롤은 #root에서 처리 */
}

#root {
  /* 페이지 전체 래퍼 */
  /* 상단: 헤더 높이(60px) + 안전 영역 + 여유 공간 */
  padding-top: calc(60px + var(--safe-top) + 20px);
  
  /* 하단: 네비 높이(70px) + 안전 영역 + 여유 공간 */
  padding-bottom: calc(70px + var(--safe-bottom) + 20px);
  
  height: 100%;
  overflow-y: auto; /* 내부 스크롤 활성화 */
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}
```

---

## 4. 고정 컴포넌트 레이아웃 (`Header` / `BottomNav`)

**핵심:** `top: 0` / `bottom: 0`으로 고정하되, `padding`으로 안전 영역을 확보하고, **내부 `div`**를 사용하여 콘텐츠를 수직 중앙 정렬합니다.

### Header (`src/components/Header.jsx`)
```javascript
<header style={{
  position: 'fixed',
  top: 0, 
  left: 0, 
  right: 0,
  paddingTop: 'env(safe-area-inset-top)', // 상단 안전 영역 확보
  background: '...',
  zIndex: 1000
}}>
  {/* 내부 콘텐츠 컨테이너 (높이 고정 + Flex 정렬) */}
  <div style={{
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 1rem'
  }}>
    {/* ... 콘텐츠 ... */}
  </div>
</header>
```

### BottomNav (`src/components/BottomNav.jsx`)
```javascript
<nav style={{
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  paddingBottom: 'var(--safe-bottom)', // 하단 안전 영역 확보
  background: '...',
  zIndex: 1000
}}>
  {/* 내부 콘텐츠 컨테이너 (높이 고정 + Flex 정렬) */}
  <div style={{
    height: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  }}>
    {/* ... 콘텐츠 ... */}
  </div>
</nav>
```

---

## 5. Android Native 설정

### AndroidManifest.xml (`android/app/src/main/AndroidManifest.xml`)
Activity 태그에 `fitsSystemWindows`와 `windowSoftInputMode`를 설정합니다.

```xml
<activity
    ...
    android:fitsSystemWindows="true"
    android:windowSoftInputMode="adjustResize">
    ...
</activity>
```

### styles.xml (`android/app/src/main/res/values/styles.xml`)
테마에서도 시스템 바 영역 확보 및 색상을 지정합니다.

```xml
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
    <!-- ... -->
    <item name="android:statusBarColor">#000000</item>
    <item name="android:fitsSystemWindows">true</item>
</style>
```

---

## 6. Capacitor Config (`capacitor.config.json`)

키보드가 올라올 때 웹뷰 사이즈를 조정하여 입력창이 가려지지 않게 합니다.

```json
{
  "plugins": {
    "Keyboard": {
      "resize": "body",
      "style": "DARK",
      "resizeOnFullScreen": true
    },
    "StatusBar": {
      "style": "DARK",
      "backgroundColor": "#000000",
      "overlaysWebView": false
    }
  }
}
```

---

## 요약
1. **Native**: `fitsSystemWindows="true"`로 시스템 바 영역 확보.
2. **Capacitor**: `overlay: false`로 웹뷰가 시스템 바 밑으로 들어가지 않게 함.
3. **CSS**: `env(safe-area-inset-*)`를 사용하여 노치/제스처 바 영역만큼 패딩 처리.
4. **Layout**: 고정 헤더/푸터는 내부 `div`로 콘텐츠 정렬 보장.
