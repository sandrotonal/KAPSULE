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
import {
  INITIAL_DOCUMENTS,
  INITIAL_RECEIPTS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_WARRANTIES,
  INITIAL_NOTES,
  INITIAL_BOOKMARKS,
  INITIAL_TIMELINE,
  INITIAL_SUGGESTIONS
} from './mockData';

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

function getStored<T>(key: string, initial: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initial;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    return initial;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage`, error);
  }
}

export class VaultStorageService {
  // Documents
  static getDocuments(): DocumentItem[] {
    return getStored(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS);
  }

  static saveDocument(doc: Omit<DocumentItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): DocumentItem {
    const docs = this.getDocuments();
    const now = new Date().toISOString().split('T')[0];
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
      id: `doc-${Date.now()}`,
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
  }

  // Receipts
  static getReceipts(): ReceiptItem[] {
    return getStored(STORAGE_KEYS.RECEIPTS, INITIAL_RECEIPTS);
  }

  static saveReceipt(receipt: Omit<ReceiptItem, 'id'> & { id?: string }): ReceiptItem {
    const receipts = this.getReceipts();
    const now = new Date().toISOString().split('T')[0];
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
      id: `rec-${Date.now()}`,
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
  }

  // Subscriptions
  static getSubscriptions(): SubscriptionItem[] {
    return getStored(STORAGE_KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS);
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
      id: `sub-${Date.now()}`,
    };
    subs.unshift(newSub);
    setStored(STORAGE_KEYS.SUBSCRIPTIONS, subs);
    return newSub;
  }

  static deleteSubscription(id: string): void {
    const subs = this.getSubscriptions().filter(s => s.id !== id);
    setStored(STORAGE_KEYS.SUBSCRIPTIONS, subs);
  }

  // Warranties
  static getWarranties(): WarrantyItem[] {
    return getStored(STORAGE_KEYS.WARRANTIES, INITIAL_WARRANTIES);
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
      id: `war-${Date.now()}`,
    };
    warranties.unshift(newWar);
    setStored(STORAGE_KEYS.WARRANTIES, warranties);
    return newWar;
  }

  static deleteWarranty(id: string): void {
    const warranties = this.getWarranties().filter(w => w.id !== id);
    setStored(STORAGE_KEYS.WARRANTIES, warranties);
  }

  // Notes
  static getNotes(): NoteItem[] {
    return getStored(STORAGE_KEYS.NOTES, INITIAL_NOTES);
  }

  static saveNote(note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): NoteItem {
    const notes = this.getNotes();
    const now = new Date().toISOString().split('T')[0];
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
      id: `note-${Date.now()}`,
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
  }

  // Bookmarks
  static getBookmarks(): BookmarkItem[] {
    return getStored(STORAGE_KEYS.BOOKMARKS, INITIAL_BOOKMARKS);
  }

  static saveBookmark(bm: Omit<BookmarkItem, 'id' | 'savedAt'> & { id?: string }): BookmarkItem {
    const bookmarks = this.getBookmarks();
    const now = new Date().toISOString().split('T')[0];
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
      id: `bm-${Date.now()}`,
      savedAt: now,
    };
    bookmarks.unshift(newBm);
    setStored(STORAGE_KEYS.BOOKMARKS, bookmarks);
    return newBm;
  }

  static deleteBookmark(id: string): void {
    const bookmarks = this.getBookmarks().filter(b => b.id !== id);
    setStored(STORAGE_KEYS.BOOKMARKS, bookmarks);
  }

  // Timeline
  static getTimeline(): TimelineEvent[] {
    return getStored(STORAGE_KEYS.TIMELINE, INITIAL_TIMELINE);
  }

  static addTimelineEvent(event: Omit<TimelineEvent, 'id'>): TimelineEvent {
    const timeline = this.getTimeline();
    const newEvent: TimelineEvent = {
      ...event,
      id: `tl-${Date.now()}`,
    };
    timeline.unshift(newEvent);
    setStored(STORAGE_KEYS.TIMELINE, timeline);
    return newEvent;
  }

  // Suggestions
  static getSuggestions(): VaultSuggestion[] {
    const suggestions: VaultSuggestion[] = [];
    const now = new Date();

    // Warranty expiries
    const warranties = this.getWarranties();
    warranties.forEach(war => {
      const expiry = new Date(war.expiryDate);
      const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 0 && diffDays <= 45) {
        suggestions.push({
          id: `sug-war-${war.id}`,
          title: `${war.productName} Warranty Expiring Soon`,
          description: `Warranty ends in ${diffDays} days. Consider booking a service if needed.`,
          type: 'urgent',
          actionLabel: 'View Warranty',
          targetScreen: 'warranties',
          linkedItemId: war.id,
          date: war.expiryDate,
        });
      }
    });

    // Subscriptions renewals
    const subscriptions = this.getSubscriptions();
    subscriptions.forEach(sub => {
      const renewal = new Date(sub.renewalDate);
      const diffDays = Math.ceil((renewal.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 0 && diffDays <= 7) {
        suggestions.push({
          id: `sug-sub-${sub.id}`,
          title: `${sub.name} Renews Soon`,
          description: `Subscription renews in ${diffDays} days.`,
          type: 'reminder',
          actionLabel: 'View Sub',
          targetScreen: 'subscriptions',
          linkedItemId: sub.id,
          date: sub.renewalDate,
        });
      }
    });

    // Return dynamic or fallback to INITIAL_SUGGESTIONS if empty so UI looks alive for new users
    return suggestions.length > 0 ? suggestions : INITIAL_SUGGESTIONS;
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
      
      // Basic normalization to TRY for stats (can be expanded)
      const rate = s.currency === 'USD' ? 34 : 1;
      const priceInBase = s.price * rate;

      if (s.billingCycle === 'monthly') {
        monthly += priceInBase;
        annual += priceInBase * 12;
      } else {
        monthly += priceInBase / 12;
        annual += priceInBase;
      }

      distribution[s.currency] = (distribution[s.currency] || 0) + s.price;
    });

    const now = new Date();
    const expiringWarranties = warranties.filter(w => {
      const expiry = new Date(w.expiryDate);
      const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 60;
    }).length;

    return {
      totalMonthlyCost: Math.round(monthly),
      totalAnnualCost: Math.round(annual),
      activeSubscriptions: subs.filter(s => s.status === 'active').length,
      activeWarranties: warranties.filter(w => w.status === 'active').length,
      expiringWarrantiesCount: expiringWarranties,
      documentCount: docs.length,
      currencyDistribution: distribution,
    };
  }

  // Settings
  static getSettings(): VaultSettings {
    const defaultSettings: VaultSettings = {
      profileName: 'Ali Can',
      profileEmail: 'Personal vault · Kapsule',
      darkMode: false,
      notifications: true,
      autoLock: false,
      passcode: '1234',
      isLocked: true,
    };
    return getStored(STORAGE_KEYS.SETTINGS, defaultSettings);
  }

  static saveSettings(settings: Partial<VaultSettings>): VaultSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    setStored(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  }

  // Reset to initial mock state if requested
  static resetVault(): void {
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.RECEIPTS);
    localStorage.removeItem(STORAGE_KEYS.SUBSCRIPTIONS);
    localStorage.removeItem(STORAGE_KEYS.WARRANTIES);
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
    localStorage.removeItem(STORAGE_KEYS.TIMELINE);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }
}
