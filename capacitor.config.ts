import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sandrotonal.kapsule',
  appName: 'Kapsule',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#000000',
      overlaysWebView: true
    },
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#000000',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    }
  }
};

export default config;
