import { storageAdapter } from './storageAdapter';
import {
  DocumentItem,
  ReceiptItem,
  SubscriptionItem,
  WarrantyItem,
  NoteItem,
  BookmarkItem,
  TimelineEvent,
  VaultSuggestion,
  VaultSettings,
  VaultStats
} from '../types';
const STORAGE_KEYS = {
  DOCUMENTS: 'kapsule_documents',
  RECEIPTS: 'kapsule_receipts',
  SUBSCRIPTIONS: 'kapsule_subscriptions',
  WARRANTIES: 'kapsule_warranties',
  NOTES: 'kapsule_notes',
  BOOKMARKS: 'kapsule_bookmarks',
  TIMELINE: 'kapsule_timeline',
  SETTINGS: 'kapsule_settings',
};

const LEGACY_DEMO_MIGRATION_KEY = 'kapsule_demo_content_removed_v1';
const LEGACY_DEMO_ID = /^(doc|rec|sub|war|note|bm|tl)-[1-9]\d*$/;

function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function todayISO(): string {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().split('T')[0];
}

function daysUntil(date: string): number {
  const today = new Date(`${todayISO()}T00:00:00`);
  const target = new Date(`${date}T00:00:00`);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getStored<T>(key: string, initial: T): T {
  return storageAdapter.getSync(key, initial);
}

function setStored<T>(key: string, value: T): void {
  storageAdapter.setSync(key, value);
}

export class VaultStorageService {
  private static removeLegacyDemoContent(): void {
    try {
      if (localStorage.getItem(LEGACY_DEMO_MIGRATION_KEY)) return;

      Object.values(STORAGE_KEYS).forEach((key) => {
        if (key === STORAGE_KEYS.SETTINGS) return;
        const items = getStored<unknown[]>(key, []);
        const userItems = items.filter((item) => {
          return !item || typeof item !== 'object' || !('id' in item) || typeof item.id !== 'string' || !LEGACY_DEMO_ID.test(item.id);
        });
        setStored(key, userItems);
      });

      const settings = getStored<VaultSettings>(STORAGE_KEYS.SETTINGS, {} as VaultSettings);
      if (settings.profileName === 'Ali Can') {
        delete settings.profileName;
        delete settings.profileEmail;
      }
      if (settings.passcode === '1234') delete settings.passcode;
      setStored(STORAGE_KEYS.SETTINGS, settings);
      localStorage.setItem(LEGACY_DEMO_MIGRATION_KEY, 'true');
    } catch (error) {
      console.error('Error removing legacy demo content', error);
    }
  }

  // Documents
  static getDocuments(): DocumentItem[] {
    this.removeLegacyDemoContent();
    return getStored(STORAGE_KEYS.DOCUMENTS, []);
  }

  static saveDocument(doc: Omit<DocumentItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): DocumentItem {
    const docs = this.getDocuments();
    const now = todayISO();
    if (doc.id) {
      const index = docs.findIndex(d => d.id === doc.id);
      if (index !== -1) {
        docs[index] = { ...docs[index], ...doc, updatedAt: now };
        setStored(STORAGE_KEYS.DOCUMENTS, docs);
        return docs[index];
      }
    }
    const newDoc: DocumentItem = {
      ...doc,
      id: createId('doc'),
      createdAt: now,
      updatedAt: now,
      isFavorite: doc.isFavorite ?? false,
      isArchived: doc.isArchived ?? false,
    };
    docs.unshift(newDoc);
    setStored(STORAGE_KEYS.DOCUMENTS, docs);

    // Auto add timeline event
    this.addTimelineEvent({
      title: `${newDoc.title} Eklendi`,
      description: `Yeni ${newDoc.category} belgesi dijital kasaya başarıyla kaydedildi.`,
      category: 'document',
      date: now,
      linkedItemId: newDoc.id,
      itemType: 'document',
    });

    return newDoc;
  }

  static toggleFavoriteDocument(id: string): DocumentItem | undefined {
    const docs = this.getDocuments();
    const doc = docs.find(d => d.id === id);
    if (doc) {
      doc.isFavorite = !doc.isFavorite;
      setStored(STORAGE_KEYS.DOCUMENTS, docs);
    }
    return doc;
  }

  static deleteDocument(id: string): void {
    const docs = this.getDocuments().filter(d => d.id !== id);
    setStored(STORAGE_KEYS.DOCUMENTS, docs);
    this.removeTimelineEventsForItem(id);
  }

  // Receipts
  static getReceipts(): ReceiptItem[] {
    this.removeLegacyDemoContent();
    return getStored(STORAGE_KEYS.RECEIPTS, []);
  }

  static saveReceipt(receipt: Omit<ReceiptItem, 'id'> & { id?: string }): ReceiptItem {
    const receipts = this.getReceipts();
    const now = todayISO();
    if (receipt.id) {
      const index = receipts.findIndex(r => r.id === receipt.id);
      if (index !== -1) {
        receipts[index] = { ...receipts[index], ...receipt };
        setStored(STORAGE_KEYS.RECEIPTS, receipts);
        return receipts[index];
      }
    }
    const newReceipt: ReceiptItem = {
      ...receipt,
      id: createId('rec'),
    };
    receipts.unshift(newReceipt);
    setStored(STORAGE_KEYS.RECEIPTS, receipts);

    this.addTimelineEvent({
      title: `${newReceipt.merchant} Faturası Kaydedildi`,
      description: `${newReceipt.amount} ${newReceipt.currency} harcama kaydı dijital kasaya işlendi.`,
      category: 'receipt',
      date: now,
      linkedItemId: newReceipt.id,
      itemType: 'receipt',
    });

    return newReceipt;
  }

  static deleteReceipt(id: string): void {
    const receipts = this.getReceipts().filter(r => r.id !== id);
    setStored(STORAGE_KEYS.RECEIPTS, receipts);
    const warranties = this.getWarranties().map((warranty) => (
      warranty.receiptId === id ? { ...warranty, receiptId: undefined } : warranty
    ));
    setStored(STORAGE_KEYS.WARRANTIES, warranties);
    this.removeTimelineEventsForItem(id);
  }

  // Subscriptions
  static getSubscriptions(): SubscriptionItem[] {
    this.removeLegacyDemoContent();
    return getStored(STORAGE_KEYS.SUBSCRIPTIONS, []);
  }

  static saveSubscription(sub: Omit<SubscriptionItem, 'id'> & { id?: string }): SubscriptionItem {
    const subs = this.getSubscriptions();
    if (sub.id) {
      const index = subs.findIndex(s => s.id === sub.id);
      if (index !== -1) {
        subs[index] = { ...subs[index], ...sub };
        setStored(STORAGE_KEYS.SUBSCRIPTIONS, subs);
        return subs[index];
      }
    }
    const newSub: SubscriptionItem = {
      ...sub,
      id: createId('sub'),
    };
    subs.unshift(newSub);
    setStored(STORAGE_KEYS.SUBSCRIPTIONS, subs);
    this.addTimelineEvent({
      title: `${newSub.name} aboneliği eklendi`,
      description: 'Abonelik kaydı kasaya eklendi.',
      category: 'subscription',
      date: todayISO(),
      linkedItemId: newSub.id,
      itemType: 'subscription',
    });
    return newSub;
  }

  static deleteSubscription(id: string): void {
    const subs = this.getSubscriptions().filter(s => s.id !== id);
    setStored(STORAGE_KEYS.SUBSCRIPTIONS, subs);
    this.removeTimelineEventsForItem(id);
  }

  static toggleSubscriptionStatus(id: string): SubscriptionItem | undefined {
    const subscriptions = this.getSubscriptions();
    const subscription = subscriptions.find((item) => item.id === id);
    if (!subscription) return undefined;

    subscription.status = subscription.status === 'active' ? 'paused' : 'active';
    setStored(STORAGE_KEYS.SUBSCRIPTIONS, subscriptions);
    return subscription;
  }

  // Warranties
  static getWarranties(): WarrantyItem[] {
    this.removeLegacyDemoContent();
    return getStored(STORAGE_KEYS.WARRANTIES, []);
  }

  static saveWarranty(war: Omit<WarrantyItem, 'id'> & { id?: string }): WarrantyItem {
    const warranties = this.getWarranties();
    if (war.id) {
      const index = warranties.findIndex(w => w.id === war.id);
      if (index !== -1) {
        warranties[index] = { ...warranties[index], ...war };
        setStored(STORAGE_KEYS.WARRANTIES, warranties);
        return warranties[index];
      }
    }
    const newWar: WarrantyItem = {
      ...war,
      id: createId('war'),
    };
    warranties.unshift(newWar);
    setStored(STORAGE_KEYS.WARRANTIES, warranties);
    this.addTimelineEvent({
      title: `${newWar.productName} garantisi eklendi`,
      description: 'Garanti kaydı kasaya eklendi.',
      category: 'warranty',
      date: todayISO(),
      linkedItemId: newWar.id,
      itemType: 'warranty',
    });
    return newWar;
  }

  static deleteWarranty(id: string): void {
    const warranties = this.getWarranties().filter(w => w.id !== id);
    setStored(STORAGE_KEYS.WARRANTIES, warranties);
    this.removeTimelineEventsForItem(id);
  }

  // Notes
  static getNotes(): NoteItem[] {
    this.removeLegacyDemoContent();
    return getStored(STORAGE_KEYS.NOTES, []);
  }

  static saveNote(note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): NoteItem {
    const notes = this.getNotes();
    const now = todayISO();
    if (note.id) {
      const index = notes.findIndex(n => n.id === note.id);
      if (index !== -1) {
        notes[index] = { ...notes[index], ...note, updatedAt: now };
        setStored(STORAGE_KEYS.NOTES, notes);
        return notes[index];
      }
    }
    const newNote: NoteItem = {
      ...note,
      id: createId('note'),
      createdAt: now,
      updatedAt: now,
      isPinned: note.isPinned ?? false,
    };
    notes.unshift(newNote);
    setStored(STORAGE_KEYS.NOTES, notes);
    return newNote;
  }

  static deleteNote(id: string): void {
    const notes = this.getNotes().filter(n => n.id !== id);
    setStored(STORAGE_KEYS.NOTES, notes);
    this.removeTimelineEventsForItem(id);
  }

  // Bookmarks
  static getBookmarks(): BookmarkItem[] {
    this.removeLegacyDemoContent();
    return getStored(STORAGE_KEYS.BOOKMARKS, []);
  }

  static saveBookmark(bm: Omit<BookmarkItem, 'id' | 'savedAt'> & { id?: string }): BookmarkItem {
    const bookmarks = this.getBookmarks();
    const now = todayISO();
    if (bm.id) {
      const index = bookmarks.findIndex(b => b.id === bm.id);
      if (index !== -1) {
        bookmarks[index] = { ...bookmarks[index], ...bm };
        setStored(STORAGE_KEYS.BOOKMARKS, bookmarks);
        return bookmarks[index];
      }
    }
    const newBm: BookmarkItem = {
      ...bm,
      id: createId('bm'),
      savedAt: now,
    };
    bookmarks.unshift(newBm);
    setStored(STORAGE_KEYS.BOOKMARKS, bookmarks);
    return newBm;
  }

  static deleteBookmark(id: string): void {
    const bookmarks = this.getBookmarks().filter(b => b.id !== id);
    setStored(STORAGE_KEYS.BOOKMARKS, bookmarks);
    this.removeTimelineEventsForItem(id);
  }

  // Timeline
  static getTimeline(): TimelineEvent[] {
    this.removeLegacyDemoContent();
    return getStored(STORAGE_KEYS.TIMELINE, []);
  }

  static addTimelineEvent(event: Omit<TimelineEvent, 'id'>): TimelineEvent {
    const timeline = this.getTimeline();
    const newEvent: TimelineEvent = {
      ...event,
      id: createId('tl'),
    };
    timeline.unshift(newEvent);
    setStored(STORAGE_KEYS.TIMELINE, timeline);
    return newEvent;
  }

  // Suggestions
  static getSuggestions(): VaultSuggestion[] {
    const suggestions: VaultSuggestion[] = [];

    // Warranty expiries
    const warranties = this.getWarranties();
    warranties.forEach(war => {
      const diffDays = daysUntil(war.expiryDate);
      if (diffDays > 0 && diffDays <= 45) {
        suggestions.push({
          id: `sug-war-${war.id}`,
          title: `${war.productName} garantisi yaklaşıyor`,
          description: `Garanti bitimine ${diffDays} gün kaldı.`,
          type: 'urgent',
          actionLabel: 'Garantiyi Gör',
          targetScreen: 'warranties',
          linkedItemId: war.id,
          date: war.expiryDate,
        });
      }
    });

    // Subscriptions renewals
    const subscriptions = this.getSubscriptions();
    subscriptions.forEach(sub => {
      if (sub.status !== 'active') return;
      const diffDays = daysUntil(sub.renewalDate);
      if (diffDays > 0 && diffDays <= 7) {
        suggestions.push({
          id: `sug-sub-${sub.id}`,
          title: `${sub.name} yenilenmek üzere`,
          description: `Abonelik yenilemesine ${diffDays} gün kaldı.`,
          type: 'reminder',
          actionLabel: 'Aboneliği Gör',
          targetScreen: 'subscriptions',
          linkedItemId: sub.id,
          date: sub.renewalDate,
        });
      }
    });

    return suggestions.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  }

  // Stats calculation
  static getStats(): VaultStats {
    const subs = this.getSubscriptions();
    const warranties = this.getWarranties();
    const docs = this.getDocuments();

    let monthly = 0;
    let annual = 0;
    const distribution: Record<string, number> = {};

    subs.forEach(s => {
      if (s.status !== 'active') return;
      
      if (s.currency !== 'TL' && s.currency !== 'TRY') return;
      const priceInBase = s.price;

      if (s.billingCycle === 'monthly') {
        monthly += priceInBase;
        annual += priceInBase * 12;
      } else {
        monthly += priceInBase / 12;
        annual += priceInBase;
      }

      distribution[s.currency] = (distribution[s.currency] || 0) + s.price;
    });

    const expiringWarranties = warranties.filter(w => {
      const diffDays = daysUntil(w.expiryDate);
      return diffDays > 0 && diffDays <= 60;
    }).length;

    return {
      totalMonthlyCost: Math.round(monthly),
      totalAnnualCost: Math.round(annual),
      activeSubscriptions: subs.filter(s => s.status === 'active').length,
      activeWarranties: warranties.filter(w => daysUntil(w.expiryDate) >= 0).length,
      expiringWarrantiesCount: expiringWarranties,
      documentCount: docs.length,
      currencyDistribution: distribution,
    };
  }

  // Settings
  static getSettings(): VaultSettings {
    this.removeLegacyDemoContent();
    const defaultSettings: VaultSettings = {
      darkMode: false,
      notifications: true,
      autoLock: false,
    };
    return getStored(STORAGE_KEYS.SETTINGS, defaultSettings);
  }

  static saveSettings(settings: Partial<VaultSettings>): VaultSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    setStored(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  static clearVaultData(): void {
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.RECEIPTS);
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTIONS);
    localStorage.removeItem(STORAGE_KEYS.WARRANTIES);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    localStorage.removeItem(STORAGE_KEYS.TIMELINE);
  }

  private static removeTimelineEventsForItem(id: string): void {
    const timeline = this.getTimeline().filter((event) => event.linkedItemId !== id);
    setStored(STORAGE_KEYS.TIMELINE, timeline);
  }
}
