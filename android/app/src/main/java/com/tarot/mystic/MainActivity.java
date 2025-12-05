package com.tarot.mystic;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 웹뷰가 시스템 바(상태바/네비바) 영역을 침범하지 않도록 설정
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
    }
}
