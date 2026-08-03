export type VaultCategory = 
  | 'document'
  | 'receipt'
  | 'subscription'
  | 'warranty'
  | 'note'
  | 'bookmark'
  | 'timeline';

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Personal' | 'Finance' | 'Insurance' | 'Vehicle' | 'Identity' | 'Health' | 'Property' | 'Work';
  fileType: 'pdf' | 'img' | 'doc';
  fileSize: string;
  previewUrl?: string;
  tags: string[];
  ocrText?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  isArchived: boolean;
}

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentItem['category'], string> = {
  Personal: 'Kişisel',
  Finance: 'Finans',
  Insurance: 'Sigorta',
  Vehicle: 'Araç',
  Identity: 'Kimlik',
  Health: 'Sağlık',
  Property: 'Mülk',
  Work: 'İş',
};

export interface ReceiptItem {
  id: string;
  merchant: string;
  merchantLogo?: string;
  amount: number;
  currency: string;
  date: string;
  category: 'Tech' | 'Home' | 'Travel' | 'Clothing' | 'Food' | 'Utilities' | 'Services';
  receiptUrl?: string;
  warrantyId?: string;
  notes?: string;
  isFavorite?: boolean;
}

export interface SubscriptionItem {
  id: string;
  name: string;
  logoUrl?: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  renewalDate: string;
  category: 'Software' | 'Entertainment' | 'Work' | 'Cloud' | 'Health' | 'Utility';
  status: 'active' | 'cancelling' | 'paused';
  notes?: string;
}

export interface WarrantyItem {
  id: string;
  productName: string;
  brand: string;
  imageUrl?: string;
  purchaseDate: string;
  expiryDate: string;
  receiptId?: string;
  serialNumber?: string;
  notes?: string;
  status: 'active' | 'expiring_soon' | 'expired';
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
}

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  domain: string;
  description?: string;
  faviconUrl?: string;
  previewUrl?: string;
  tags: string[];
  savedAt: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  category: VaultCategory;
  date: string;
  linkedItemId?: string;
  itemType?: VaultCategory;
  iconName?: string;
}

export interface VaultSuggestion {
  id: string;
  title: string;
  description: string;
  type: 'urgent' | 'reminder' | 'tip';
  actionLabel?: string;
  targetScreen?: string;
  linkedItemId?: string;
  date?: string;
}

export type ActiveTab = 'home' | 'documents' | 'receipts' | 'subscriptions' | 'warranties' | 'notes' | 'bookmarks' | 'timeline' | 'settings';

export interface VaultSettings {
  profileName?: string;
  profileEmail?: string;
  darkMode: boolean;
  notifications: boolean;
  autoLock: boolean;
  passcode?: string;
}

export interface VaultStats {
  totalMonthlyCost: number;
  totalAnnualCost: number;
  activeSubscriptions: number;
  activeWarranties: number;
  expiringWarrantiesCount: number;
  documentCount: number;
  currencyDistribution: Record<string, number>;
}
