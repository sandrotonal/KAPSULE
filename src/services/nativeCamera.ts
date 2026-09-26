import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export interface CapturedPhotoResult {
  dataUrl?: string;
  format?: string;
  success: boolean;
  errorMessage?: string;
}

export const NativeCameraService = {
  /**
   * Captures a photo using the native device camera (or photo album on web/desktop).
   * Returns a base64 DataUrl suitable for storing in the local vault.
   */
  async capturePhoto(source: 'camera' | 'photos' = 'camera'): Promise<CapturedPhotoResult> {
    try {
      // Check permissions if running natively
      if (Capacitor.isNativePlatform()) {
        try {
          const perm = await Camera.checkPermissions();
          if (perm.camera !== 'granted') {
            const req = await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
            if (req.camera !== 'granted') {
              return {
                success: false,
                errorMessage: 'Kamera erişim izni verilmedi.',
              };
            }
          }
        } catch (permErr) {
          console.debug('Permission check bypassed or unsupported:', permErr);
        }
      }

      const image = await Camera.getPhoto({
        quality: 85,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: source === 'camera' ? CameraSource.Camera : CameraSource.Photos,
      });

      if (image.dataUrl) {
        return {
          dataUrl: image.dataUrl,
          format: image.format,
          success: true,
        };
      }

      return {
        success: false,
        errorMessage: 'Fotoğraf verisi alınamadı.',
      };
    } catch (error) {
      const err = error as Error;
      // Handle user cancellation gracefully
      if (err.message?.toLowerCase().includes('cancelled') || err.message?.toLowerCase().includes('canceled')) {
        return { success: false };
      }
      console.warn('Camera capture error, falling back:', error);
      return {
        success: false,
        errorMessage: err.message || 'Kamera açılamadı.',
      };
    }
  },
};
