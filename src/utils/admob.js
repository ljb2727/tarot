import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

export async function initializeAdMob() {
  try {
    await AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: ['2077ef9a63d2b398840261c8221a0c9b'],
      initializeForTesting: true,
    });
    console.log('AdMob initialized');
  } catch (e) {
    console.error('AdMob initialization failed', e);
  }
}

export async function showBannerAd() {
  try {
    const options = {
      adId: 'ca-app-pub-3940256099942544/6300978111', // Test Banner ID
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: true
    };
    await AdMob.showBanner(options);
  } catch (e) {
    console.error('Failed to show banner', e);
  }
}

export async function hideBannerAd() {
  try {
    await AdMob.hideBanner();
  } catch (e) {
    console.error('Failed to hide banner', e);
  }
}

export async function showInterstitialAd() {
  try {
    const options = {
      adId: 'ca-app-pub-3940256099942544/1033173712', // Test Interstitial ID
      isTesting: true
    };
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  } catch (e) {
    console.error('Failed to show interstitial', e);
  }
}
