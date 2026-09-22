import { VaultStorageService } from './vaultStorage';
import { triggerHaptic } from '../utils/haptics';

export interface VaultReminder {
  id: string;
  type: 'warranty' | 'subscription';
  title: string;
  subtitle: string;
  date: string;
  daysRemaining: number;
  urgency: 'critical' | 'warning' | 'info';
}

export class NotificationService {
  private static STORAGE_KEY_LAST_CHECK = 'kapsule_last_notification_check';

  /**
   * Request system notification permission from browser/OS
   */
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Tarayıcı bildirimleri desteklenmiyor.');
      return false;
    }

    try {
      if (Notification.permission === 'granted') {
        return true;
      }
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (e) {
      console.error('Bildirim izni alınamadı:', e);
      return false;
    }
  }

  /**
   * Check if notifications are allowed
   */
  static isPermissionGranted(): boolean {
    if (!('Notification' in window)) return false;
    return Notification.permission === 'granted';
  }

  /**
   * Send a rich browser notification
   */
  static async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
    const settings = VaultStorageService.getSettings();
    if (!settings.notifications) return;

    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    try {
      new Notification(title, {
        icon: '/src/assets/logo.png',
        badge: '/src/assets/logo.png',
        silent: false,
        ...options,
      });
      triggerHaptic.success();
    } catch (e) {
      console.error('Bildirim gönderilemedi:', e);
    }
  }

  /**
   * Calculate all upcoming expiration and renewal reminders
   */
  static getUpcomingReminders(): VaultReminder[] {
    const reminders: VaultReminder[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 1. Check Warranties
    const warranties = VaultStorageService.getWarranties();
    warranties.forEach(war => {
      const expDate = new Date(war.expiryDate);
      expDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays <= 30) {
        let urgency: VaultReminder['urgency'] = 'info';
        let subtitle = '';

        if (diffDays < 0) {
          urgency = 'critical';
          subtitle = `Garantisi ${Math.abs(diffDays)} gün önce bitti`;
        } else if (diffDays === 0) {
          urgency = 'critical';
          subtitle = 'Garanti süresi BUGÜN doluyor!';
        } else if (diffDays <= 7) {
          urgency = 'critical';
          subtitle = `Garanti ${diffDays} gün içinde sona eriyor`;
        } else {
          urgency = 'warning';
          subtitle = `Garanti bitimine ${diffDays} gün kaldı`;
        }

        reminders.push({
          id: `war-${war.id}`,
          type: 'warranty',
          title: war.productName,
          subtitle,
          date: war.expiryDate,
          daysRemaining: diffDays,
          urgency,
        });
      }
    });

    // 2. Check Subscriptions
    const subscriptions = VaultStorageService.getSubscriptions();
    subscriptions.forEach(sub => {
      if (sub.status === 'paused') return;

      const renewalDate = new Date(sub.renewalDate);
      renewalDate.setHours(0, 0, 0, 0);
      const diffDays = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays <= 7) {
        let urgency: VaultReminder['urgency'] = 'info';
        let subtitle = '';

        if (diffDays === 0) {
          urgency = 'critical';
          subtitle = `Bugün yenileniyor (${sub.price} ${sub.currency})`;
        } else if (diffDays === 1) {
          urgency = 'warning';
          subtitle = `Yarın yenilenecek (${sub.price} ${sub.currency})`;
        } else if (diffDays > 1) {
          urgency = 'info';
          subtitle = `${diffDays} gün sonra yenilenecek (${sub.price} ${sub.currency})`;
        } else {
          urgency = 'warning';
          subtitle = `Yenileme tarihi geçti (${sub.price} ${sub.currency})`;
        }

        reminders.push({
          id: `sub-${sub.id}`,
          type: 'subscription',
          title: sub.name,
          subtitle,
          date: sub.renewalDate,
          daysRemaining: diffDays,
          urgency,
        });
      }
    });

    // Sort by urgency and closest days remaining
    return reminders.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }

  /**
   * Run a daily background notification check
   */
  static runDailyCheck(): void {
    const settings = VaultStorageService.getSettings();
    if (!settings.notifications) return;

    const todayStr = new Date().toISOString().slice(0, 10);
    const lastCheck = localStorage.getItem(this.STORAGE_KEY_LAST_CHECK);

    // Only notify once per calendar day
    if (lastCheck === todayStr) return;

    const reminders = this.getUpcomingReminders();
    const urgentItems = reminders.filter(r => r.urgency === 'critical' || r.daysRemaining === 3 || r.daysRemaining === 1);

    if (urgentItems.length > 0) {
      const first = urgentItems[0];
      const count = urgentItems.length;
      const body = count === 1 
        ? `${first.title}: ${first.subtitle}` 
        : `${first.title} ve ${count - 1} diğer öğeniz için hatırlatma var.`;

      this.sendNotification('Kapsule Hatırlatıcı', {
        body,
        tag: 'kapsule-daily-digest',
      });
    }

    localStorage.setItem(this.STORAGE_KEY_LAST_CHECK, todayStr);
  }

  static getPermissionStatus(): 'granted' | 'denied' | 'default' | 'unsupported' {
    if (typeof window === 'undefined' || !('Notification' in window)) return 'unsupported';
    return Notification.permission;
  }

  static async sendTestNotification(): Promise<boolean> {
    const granted = await this.requestPermission();
    if (!granted) return false;

    try {
      new Notification('Kapsule Test Bildirimi', {
        body: 'Kasa bildirim ve hatırlatma sistemi cihazınızda başarıyla çalışıyor!',
        icon: '/src/assets/logo.png',
        badge: '/src/assets/logo.png',
        tag: 'kapsule-test',
      });
      triggerHaptic.success();
      return true;
    } catch {
      return false;
    }
  }
}

export default NotificationService;
