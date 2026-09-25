import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export const NativeStatusBarService = {
  /**
   * Dynamically synchronizes StatusBar and meta theme-color with application theme.
   * Works safely on web, iOS, and Android.
   */
  async syncWithTheme(isDark: boolean): Promise<void> {
    try {
      // 1. Web / PWA Meta tag sync
      let metaTheme = document.querySelector('meta[name="theme-color"]');
      if (!metaTheme) {
        metaTheme = document.createElement('meta');
        metaTheme.setAttribute('name', 'theme-color');
        document.head.appendChild(metaTheme);
      }
      metaTheme.setAttribute('content', isDark ? '#000000' : '#ffffff');

      // 2. Native Capacitor StatusBar sync
      if (Capacitor.isNativePlatform()) {
        await StatusBar.setStyle({
          style: isDark ? Style.Dark : Style.Light,
        });

        // Set transparent or matching color for edge-to-edge
        await StatusBar.setBackgroundColor({
          color: isDark ? '#000000' : '#ffffff',
        });

        await StatusBar.setOverlaysWebView({
          overlay: true,
        });
      }
    } catch (error) {
      // Graceful fallback for browsers or environments without native status bar
      console.debug('StatusBar sync skipped (non-native or unsupported):', error);
    }
  },
};
