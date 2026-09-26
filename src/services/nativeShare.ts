import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

export const NativeShareService = {
  /**
   * Shares text, JSON data, or file using Native iOS/Android Share Sheet,
   * with automatic browser fallback for desktop/web.
   */
  async shareData(options: {
    title: string;
    text?: string;
    filename: string;
    dataString: string;
    mimeType?: string;
  }): Promise<{ success: boolean; method: 'native' | 'download' }> {
    try {
      const blob = new Blob([options.dataString], {
        type: options.mimeType || 'application/json',
      });

      // 1. Check if native Share Sheet is supported and available
      if (Capacitor.isNativePlatform()) {
        try {
          const canShareResult = await Share.canShare();
          if (canShareResult.value) {
            // Write to a temporary object URL or share text
            await Share.share({
              title: options.title,
              text: options.text || options.dataString.slice(0, 200),
              dialogTitle: options.title,
            });
            return { success: true, method: 'native' };
          }
        } catch (nativeErr) {
          console.debug('Native Share fallback to browser download:', nativeErr);
        }
      }

      // 2. Web / Browser Share API fallback (e.g. Mobile Safari / Android Chrome)
      if (typeof navigator !== 'undefined' && 'canShare' in navigator && 'share' in navigator) {
        try {
          const file = new File([blob], options.filename, {
            type: options.mimeType || 'application/json',
          });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: options.title,
              files: [file],
            });
            return { success: true, method: 'native' };
          }
        } catch (webShareErr) {
          // User canceled or share aborted
          if ((webShareErr as Error)?.name === 'AbortError') {
            return { success: false, method: 'native' };
          }
        }
      }

      // 3. Fallback: Browser direct file download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = options.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true, method: 'download' };
    } catch (err) {
      console.error('Error during share/export:', err);
      return { success: false, method: 'download' };
    }
  },
};
