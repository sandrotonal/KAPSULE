import { Preferences } from '@capacitor/preferences';

/**
 * Mobile-First Native Storage Adapter
 * Primary storage: Capacitor Preferences (Native Persistent Storage)
 * Fallback storage: Window LocalStorage (Web environment)
 */
export const storageAdapter = {
  /**
   * Synchronously get item from localStorage as initial cache / web fallback
   */
  getSync<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  /**
   * Synchronously set item in localStorage for cache consistency
   */
  setSync<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      // Asynchronously mirror to Capacitor Preferences
      Preferences.set({ key, value: serialized }).catch(() => {});
    } catch (error) {
      console.error(`[StorageAdapter] Failed to set key "${key}":`, error);
    }
  },

  /**
   * Async get from native persistent storage
   */
  async getAsync<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const { value } = await Preferences.get({ key });
      if (value !== null) {
        // Also update local cache
        try {
          localStorage.setItem(key, value);
        } catch {}
        return JSON.parse(value);
      }
      return this.getSync(key, defaultValue);
    } catch {
      return this.getSync(key, defaultValue);
    }
  },

  /**
   * Async set to native persistent storage
   */
  async setAsync<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      await Preferences.set({ key, value: serialized });
    } catch (error) {
      console.error(`[StorageAdapter] Async set error for "${key}":`, error);
    }
  },

  /**
   * Remove item from both storages
   */
  async removeAsync(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
      await Preferences.remove({ key });
    } catch (error) {
      console.error(`[StorageAdapter] Remove error for "${key}":`, error);
    }
  },

  /**
   * Clear all storage
   */
  async clearAsync(): Promise<void> {
    try {
      localStorage.clear();
      await Preferences.clear();
    } catch (error) {
      console.error('[StorageAdapter] Clear error:', error);
    }
  },

  /**
   * Hydrates localStorage cache from native Capacitor Preferences on app launch.
   * Ensures zero sync loss when running inside native mobile environments.
   */
  async hydrateFromPreferences(): Promise<void> {
    try {
      const { keys } = await Preferences.keys();
      for (const key of keys) {
        if (key.startsWith('kapsule_')) {
          const { value } = await Preferences.get({ key });
          if (value !== null) {
            localStorage.setItem(key, value);
          }
        }
      }
    } catch (e) {
      // In pure web environments or when Preferences is unavailable, gracefully ignore
      console.warn('[StorageAdapter] Preferences hydration skipped:', e);
    }
  },
};
