# KAPSULE — Geliştirme & Yayın Planı (Detaylı Yol Haritası)

> **Nihai hedef:** Şu anki web uygulamasını (Vite + React) gerçek, mağazada yayınlanabilir bir
> **mobil uygulamaya** dönüştürmek; veri katmanını sağlamlaştırmak, UX/UI'i premium seviyeye
> çıkarmak ve **performans/veri kaybı** risklerini sıfırlamak.
>
> **Güncel durum (kod incelemesine dayalı):**
> - Stack: `Vite + React 18 + TypeScript + Tailwind CSS + Framer Motion + lucide-react + TanStack Query`
> - Veri katmanı: `localStorage` (`src/services/vaultStorage.ts`, 484 satır)
> - Navigasyon: `src/App.tsx` içinde `switch(activeTab)` + `refreshKey` zorla-tazeleme deseni
> - Veri modelleri: `src/types/index.ts` (document, receipt, subscription, warranty, note, bookmark, timeline, settings, stats)
> - UI bileşenleri: `src/components/ui/*` (Card, Button, Input, Modal, Badge, Toast, WalletCard, TiltCard…)
> - Ekranlar: `src/features/{home,documents,receipts,subscriptions,warranties,notes,bookmarks,timeline,settings,onboarding,search}/*`
> - **Web app haliyle Play Store / App Store'a yüklenemez. Bu belgenin 1. fazı bunu çözer.**

---

## Bölüm 0 — Karar: Nasıl "Native" Olacağız?

| Seçenek | Açıklama | Avantaj | Dezavantaj |
|---|---|---|---|
| **✅ Capacitor (ÖNERİ)** | Mevcut web kodunu native kabuğa sarar | Kod %100 korunur, ekranlar değişmez, hızlı sonuç, Play+App Store desteği | %100 native performans değil (WebView) |
| React Native (Expo) | Kod yeniden yazılır | Gerçek native his | Büyük emek, mevcut proje ziyan |
| Flutter | Kod yeniden yazılır | Gerçek native his | Büyük emek, yeni dil öğrenme |

> **Öneri:** Capacitor. Mevcut React/Tailwind kodunun tamamı kalır; APK/IPA üretilir.
> İleride gerekirse yavaş yavaş native modüllere geçilir.

---

## FAZ 1 — Gerçek Mobil Uygulamaya Geçiş (Capacitor)

Bu fazın sonunda **telefonunda çalışan gerçek bir app** var.

### 1.1 Kapasitör kurulumu (komut komut)
```bash
# Bağımlılıkları kur
npm i @capacitor/core @capacitor/cli

# Projeyi Capacitor'e tanıt (bundleId benzersiz olmalı)
npx cap init "Kapsule" "com.sandrotonal.kapsule" --web-dir=dist

# Android platformunu ekle
npm i @capacitor/android
npx cap add android
```

> **Not:** iOS (iOS platformu) için **macOS + Xcode** şart. Windows'ta sadece Android geliştirilir.
> iOS platformu eklense bile `npx cap add ios` çalışmaz. Mac alınca eklenecek.

### 1.2 İlk çalıştırma
```bash
# Web uygulamasını build et (Capacitor dist/ klasörünü kullanır)
npm run build

# Web dosyalarını native projeye kopyala
npx cap sync

# Android Studio'yu aç
npx cap open android
```
- Android Studio'da cihaz/emülatör seç → **Run** → app telefondan açılır.

### 1.3 Veri depolama: localStorage → Kalıcı depo (KRİTİK)
> Capacitor'ün WebView'ı `localStorage` destekler **ama** temizlenebilir/yavaş olabilir ve iOS'ta
> kısıtlıdır. Cihazda kalıcı + güvenli depolama şart.

```bash
npm i @capacitor/preferences
```

`src/services/vaultStorage.ts` içindeki tüm `localStorage` çağrılarını (`getStored` / `setStored`) şuna çevir:

```ts
import { Preferences } from '@capacitor/preferences';

// localStorage.getItem(key) yerine:
const { value } = await Preferences.get({ key });
return value ? JSON.parse(value) : initial;

// localStorage.setItem(key, val) yerine:
await Preferences.set({ key, value: JSON.stringify(value) });
```

**Dikkat (web uyumluluğu):** Tarayıcıda da çalışsın istiyorsan bir storage arayüzü (`IStorage`) yapıp
cihazda `Preferences`, web'de `localStorage` kullanacak şekilde iki implementasyon ver.

### 1.4 App kimliği ve görselleri
- **App icon:** `logo/` klasöründeki logoyu kullan. Android: `android/app/src/main/res/mipmap-*`
- **Splash screen:** `@capacitor/splash-screen` ile basit beyaz/logo splash
- **Uygulama adı & versiyon:** `android/app/src/main/AndroidManifest.xml` + `build.gradle`
  (örn. `versionName "1.0.0"`, `versionCode 1`)

### 1.5 Güvenlik kilidini geliştir
- Passcode zaten var (`src/components/common/PasscodeLock.tsx`).
- **Biyometrik (parmak izi/Face ID)** ekle:
  ```bash
  npm i @capacitor/biometric-auth
  ```
- Passcode girildikten sonra `isLocked=false` → biyometrik başarısızsa passcode'a düş.

### 1.6 Store önkoşulları (bu fazda hazırlanır)
- Gizlilik politikası ekranı/sayfası (store zorunlu tutar)
- Kullanım koşulları ekranı
- App açıklama metinleri, anahtar kelimeler, ekran görselleri

---

## FAZ 2 — Veri Katmanı & Bulut (MİSYON KRİTİK)

**Sorun:** `localStorage` cihaza bağlı. Telefon değişir/app silinir/sistem temizlerse **tüm veri gider.**

### 2.1 Cihaz üstü verimli depo (opsiyonel ama önerilir)
- Çok veri birikince `@capacitor/preferences` yerine SQLite:
  ```bash
  npm i @capacitor-community/sqlite
  ```
- Okuma/yazma hızı artar, filtreleme SQL ile olur.

### 2.2 Bulut senkronizasyon — Supabase (asıl çözüm)
```bash
npm i @supabase/supabase-js
```
1. Supabase projesi aç (https://supabase.com → yeni proje).
2. Tabloları `src/types/index.ts`'teki modellere göre oluştur
   (`documents`, `receipts`, `subscriptions`, `warranties`, `notes`, `bookmarks`, `settings`).
3. **Auth:** Email + Google OAuth ile giriş. Her satıra `user_id` ekle.
4. **RLS (Row Level Security)** aç — kullanıcı sadece kendi satırlarını görsün. (Bu şart! Yoksa herkes herkesin verisini okur.)
5. **Offline-first strateji:**
   - Cihazda depo varsa onu göster (anlık, offline).
   - Çevrimiçi olunca Supabase ile **çift yönlü senkronize** et (last-updated zaman damgasıyla çakışma çöz).
6. **Cihaz değiştirme akışı:** Yeni cihazda "Giriş yap" → veriler buluttan restore edilir.

### 2.3 Veri şifreleme (hassas belgeler için)
- Belgeler/fişler görsel olabilir → yüklemeden önce şifrele (örn. `crypto.subtle` AES-GCM, şifre anahtarı cihazda).
- En azından veri taşınırken TLS (HTTPS) + Supabase şifreli depolaması zaten devrede.

---

## FAZ 3 — UX / UI İyileştirmeleri

### 3.1 Boş durum ekranları (empty states)
Her koleksiyon ekranına (`DocumentsScreen`, `ReceiptsScreen`…) veri boşsa ekle:
- Sevimli bir ikon + "Kasan henüz boş" + ilk kaydı ekleyen CTA buton.
- Şu an boşken koca boş alan görünüyor — kullanıcı ne yapacağını bilmiyor.

### 3.2 Bildirimler (Push & Local)
```bash
npm i @capacitor/push-notifications @capacitor/local-notifications
```
- **Abonelik yenileme** (`SubscriptionItem.renewalDate`) öncesi 3 gün kala hatırlatma.
- **Garanti bitiş** (`WarrantyItem.expiryDate`) öncesi 1 hafta kala uyarı.
- Ayarlardan `notifications` toggle'ına bağla (zaten `VaultSettings.notifications` var).

### 3.3 Navigasyon & kod sadeleştirme
`src/App.tsx` şu an ~228 satır ve tüm ekranları `switch` ile yönetiyor. İyileştir:
- **Routing:** `react-router-dom` ile `/:tab` URL tabanlı gezinme (geri butonu çalışır).
- **State:** `App.tsx`'teki tüm state'i bir context veya zustand store'una taşı.
- **Derin linkleme:** `selectedItemId` örneği → route param'a çevir.

### 3.4 Reaktif veri tazeleme (performans + sadelik)
**Şu an:** `refreshKey` artınca tüm ekranlar yeniden render oluyor + her render'da `localStorage` okunuyor.
```tsx
// HomeScreen.tsx şu an yapıyor:
const docs = VaultStorageService.getDocuments(); // render içinde senkron okuma ❌
```
**Yapılacak:**
- `@tanstack/react-query` zaten kurulu ama kullanılmıyor gibi. Veri çekme işlemlerini `useQuery`'ye taşı.
- Yazma işlemlerini `useMutation` + `queryClient.invalidateQueries()` ile yönet.
- `refreshKey` deseni tamamen kalkar; veri değişince otomatik tazelenir.
- `HomeScreen`'deki 6 senkron `get*()` çağrısını tek bir hook'a (`useVaultData`) topla.

### 3.5 Mikro etkileşimler
- Butonlara `active:scale-95` (çoğu var) → eklenecek eksikler.
- **Haptic feedback:** `@capacitor/haptics` ile "Yeni ekle", kaydetme, silme anlarında titreşim.
- TiltCard/WalletCard 3D efektlerini düşük performanslı cihazlarda kapat (bkz. Bölüm 5).

### 3.6 Ayarlar zenginliği
- **Dil:** Türkçe ↔ İngilizce (i18n: `react-i18next` veya basit locale dosyası).
- **Para birimi:** Ayardan seçilebilir (şu an `formatCurrency` sabit 'TL').
- **Tema:** `system` / açık / koyu üçlüsü.
- **Veri dışa aktar:** JSON export/import (yedekleme için güzel bir acil durum çözümü).

---

## FAZ 4 — Performans İyileştirmeleri

> Kullanıcı deneyimini bitiren #1 şey gecikme. Mobil app için hedefler:
> - İlk açılış: < 2 sn
> - Ekran geçişleri: 60 fps, gecikmesiz
> - Veri listeleri: kaydırırken takılma yok

### 4.1 Render/veri sorunları (kodda tespit edilenler)
| Sorun | Yer | Çözüm |
|---|---|---|
| Render içinde senkron `localStorage` okuma | `HomeScreen.tsx` (6 `get*()` çağrısı) | `useQuery` / `useMemo` / store |
| `refreshKey` ile tüm ekranı zorla render | `App.tsx` | React Query invalidation |
| Büyük listenin tamamı render | `DocumentsScreen`, `ReceiptsScreen`… | `@tanstack/react-virtual` veya `window.native` ile sanallaştırma |
| Framer Motion ağır animasyonlar her zaman açık | TiltCard, WalletCard | `prefers-reduced-motion` + düşük cihazda kapat |
| Görseller/faviconlar yüklenmeden önce FOUC | çeşitli ekranlar | `loading="lazy"`, `srcset` |

### 4.2 Build & paket boyutu
- Vite üretim build'inde **code-splitting** yap: her ekranı ayrı chunk'a ayır (`React.lazy`).
- Kullanılmayan lucide-react ikonlarını tree-shake et (lucide zaten tree-shake destekler, importları `import { X } from 'lucide-react'` yapıyorsan sorun yok).
- Supabase web client'ı yalnızca senkronizasyon ekranında lazy-load et.
- `npx vite build` çıktısını `dist/` üzerinde kontrol et; 300 KB JS gzip üstüne çıkan blokları böl.

### 4.3 Start-up hızı
- Onboarding/passcode ekranı hariç her şeyi `React.lazy` ile ertele.
- İlk ekran (Home) en kritik — logo ve fontlar preload olsun.

---

## FAZ 5 — Mağaza Yayını

### 5.1 Google Play
1. [Google Play Developer](https://play.google.com/console) hesabı → tek seferlik **$25**.
2. Build AAB:
   ```bash
   cd android && ./gradlew bundleRelease
   ```
3. `android/app/build/outputs/bundle/release/app-release.aab` dosyasını Play Console'a yükle.
4. İç test (Internal testing) → kapalı test → üretime geç.
5. Store listelemesi: ikon, ekran görselleri, açıklama, gizlilik politikası.

### 5.2 App Store
1. [Apple Developer](https://developer.apple.com) hesabı → yıllık **$99**. macOS + Xcode gerekli.
2. `npx cap add ios` → Xcode'da aç → imzala.
3. TestFlight ile beta testi → App Store onayı.
> Windows'ta bu adım yapılamaz; macOS gerekir.

### 5.3 Sürüm yönetimi
- Semantik versiyonlama: `major.minor.patch` (örn. 1.0.0 → 1.1.0).
- Her sürümde `versionCode` (Android) / `build number` (iOS) artır.

---

## Nihai Kontrol Listesi (Checklist)

- [ ] Capacitor kuruldu, app telefonda açılıyor (FAZ 1)
- [ ] `vaultStorage.ts` → `@capacitor/preferences` geçti, web'de de çalışıyor
- [ ] App icon + splash + ad + versiyon ayarlandı
- [ ] Biyometrik kilit eklendi
- [ ] Supabase kuruldu, RLS + auth aktif
- [ ] Offline-first senkronizasyon çalışıyor
- [ ] Boş durum ekranları eklendi
- [ ] Abonelik/garanti bildirimleri eklendi
- [ ] `App.tsx` router + store ile sadeleştirildi
- [ ] React Query'e geçildi, `refreshKey` kaldırıldı
- [ ] Listeler sanallaştırıldı, animasyonlar `prefers-reduced-motion`'a bağlandı
- [ ] Vite code-splitting aktif, paket boyutu optimize
- [ ] Gizlilik politikası + kullanım koşulları eklendi
- [ ] Play Store'a AAB yüklendi (veya planlandı)
- [ ] App Store için macOS/Xcode planı hazır

---

## Öncelik Sırası (Yol Haritası)

| Sıra | İş | Faz | Zorluk | Kazanım |
|---|---|---|---|---|
| 1 | Capacitor + Android | FAZ 1 | Orta | Telefonda gerçek app |
| 2 | localStorage → Preferences | FAZ 1 | Düşük | Veri kaybı önlenir |
| 3 | Boş durumlar + UX | FAZ 3 | Orta | Premium his |
| 4 | React Query + sadeleştirme | FAZ 3 | Orta | Hız + bakım kolaylığı |
| 5 | Push bildirim | FAZ 3 | Orta | Abonelik/garanti uyarı |
| 6 | Supabase senkronizasyon | FAZ 2 | Yüksek | Cihazlar arası yedek |
| 7 | Performans & code-splitting | FAZ 4 | Orta | Akıcı deneyim |
| 8 | Store yayını | FAZ 5 | Orta | Lansman |

> **Önerilen başlangıç:** **1 → 2 → 3 → 4** sırası. Yani önce app'i telefonda gör,
> veriyi kalıcı yap, sonra UX'i parlat, sonra performansı yükselt.

---

*Bu doküman `GELISTIRME-PLANI.md` — proje ilerledikçe güncellenmeli. Bittiği her maddeye ✅ işaretleyin.*
