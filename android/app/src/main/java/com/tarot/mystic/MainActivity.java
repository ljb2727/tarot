package com.tarot.mystic;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    // CSS에서 safe-area를 제어하기 위해 앱이 전체 화면을 사용하도록 설정합니다.
    WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
  }
}
