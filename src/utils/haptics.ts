import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Mobile Haptics Helper Utility
 * Triggers subtle physical haptic feedback on iOS and Android devices.
 * Gracefully degrades on Web / desktop browsers.
 */
export const triggerHaptic = {
  light: async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // Degrades silently on unsupported browsers
    }
  },
  medium: async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      // Degrades silently on unsupported browsers
    }
  },
  heavy: async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch {
      // Degrades silently on unsupported browsers
    }
  },
  success: async () => {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      // Degrades silently on unsupported browsers
    }
  },
  warning: async () => {
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch {
      // Degrades silently on unsupported browsers
    }
  },
  error: async () => {
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch {
      // Degrades silently on unsupported browsers
    }
  },
};
