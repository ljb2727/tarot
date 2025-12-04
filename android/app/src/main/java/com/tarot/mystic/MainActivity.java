package com.tarot.mystic;

import android.os.Bundle;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Capacitor가 화면을 제어하도록 Edge-to-Edge 모드를 허용합니다.
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
    }
}
