# Kapsule — Everything important. One place.

![Kapsule](public/logo.png)

> **Kapsule**, önemli her şeyi tek bir kasa altında toplayan kişisel dijital kasa uygulamasıdır. Belgeler, fişler, abonelikler, garantiler, notlar ve yer imleri — hepsi tek bir yerden, ultra güvenli, çevrimdışı ve sessiz lüks (Quiet Luxury) arayüzle yönetilir.  
> **Apple App Store** ve **Google Play Store** mağaza standartlarına uygun olarak React 18, TypeScript ve Capacitor ile paketlenmiştir.

---

## Öne Çıkan Özellikler

### Kasa ve Donanım Güvenliği
- **Kişisel Kasa PIN Kilidi ve Kaba Kuvvet Koruması:** 4 haneli PIN şifreleme ve 5 hatalı deneme sonrası 30 saniyelik otomatik donanım kilidi.
- **Biyometrik Giriş (Face ID / Touch ID / Parmak İzi):** Cihaz donanımıyla tek dokunuşla kilit açma (`NativeBiometricsService`).
- **Sıfır Sunucu ve %100 Çevrimdışı Gizlilik:** Hiçbir veri üçüncü taraf sunuculara veya izleyicilere aktarılmaz; veriler sadece cihazın korumalı sandbox alanında saklanır.
- **Android `allowBackup="false"` Koruması:** USB ve adb üzerinden şifresiz veri sızıntılarına karşı tam koruma (OWASP MASVS standartları).

### Kamera, Görseller ve Fotoğraf Kırpma
- **Doğrudan Fiş ve Belge Tarama:** `@capacitor/camera` entegrasyonu ile kamera veya galeriden belge tarayıp kasaya ekleme.
- **İnteraktif Profil Kırpma ve Hizalama (Avatar Cropper):** 
  - Dokunmatik ve fare ile vizör içinde kaydırma (pan drag)
  - 1x - 3x kesintisiz yakınlaştırma kaydırıcısı (zoom slider)
  - 90 derece yön çevirme ve sıfırlama
  - 3te 1 kuralı kılavuz ızgarası (rule-of-thirds grid)
  - 400x400 px yüksek kaliteli JPEG kayıpsız çıktı

### Quiet Luxury Tasarım ve Akıcılık
- **Ultra Akıcı Sayfa Geçişleri (Zero-Jank):** 0ms tepki süresi, GPU hızlandırmalı 180ms mikro geçişler; 60/120 FPS akıcı kart fiziği.
- **Çift Katmanlı Çekmeceler (Slide-Out Drawers):** Profil kartı ve abonelik kartlarında tek tıkla açılıp kapanan, simetrik ve dengeli arayüz mimarisi.
- **İnteraktif Cüzdan (WalletCard):** Fiziksel kart cebi hissi, kartlar arası akıcı geçiş animasyonu.
- **Safe Area ve Donanım Geometrisi:** Dynamic Island, çentik (`safe-area-inset-top`) ve alt Home Indicator (`safe-area-inset-bottom`) ile tam uyumlu.
- **Koyu / Açık Mod ve StatusBar Senkronizasyonu:** `NativeStatusBarService` ile sistem temasına göre otomatik güncellenen durum çubuğu stili.

### Mağaza ve Yasal Uyumluluk (Store Compliance)
- **Apple App Store Review 5.1.1 Uyumlu:** Uygulama içi Gizlilik Politikası, Kullanım Koşulları ve İletişim modalları.
- **Veri Sıfırlama (Data Deletion):** Apple Store zorunlu kuralı uyarınca çift onaylı tüm kasayı sıfırlama mekanizması.
- **Google Play Target SDK 36:** Android 14+ gereksinimlerini karşılayan güncel API seviyesi.
- **Native Paylaşım (Share Sheet):** AirDrop, WhatsApp, Google Drive ve Dosyalar üzerinden şifreli JSON kasa yedeği dışa aktarma (`@capacitor/share`).

---

## Teknolojiler

<p align="left">
  <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white" alt="Capacitor" />
  <img src="https://img.shields.io/badge/Android_SDK_36-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Android" />
  <img src="https://img.shields.io/badge/Apple_iOS-000000?style=for-the-badge&logo=apple&logoColor=white" alt="iOS" />
</p>

| Logo | Teknoloji | Mimari Rol / Kapsam |
|:---:|---|---|
| <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" width="22" height="22" alt="React" /> | [React 18](https://react.dev/) | Reaktif bileşen mimarisi ve kullanıcı arayüzü |
| <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TypeScript.svg" width="22" height="22" alt="TypeScript" /> | [TypeScript](https://www.typescriptlang.org/) | Sıkı tip denetimi ve mimari güvenilirlik (0 Any, 0 Hata) |
| <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Vite-Dark.svg" width="22" height="22" alt="Vite" /> | [Vite](https://vite.dev/) | Hızlı derleme ve optimize üretim paketi (dist) |
| <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TailwindCSS-Dark.svg" width="22" height="22" alt="Tailwind CSS" /> | [Tailwind CSS](https://tailwindcss.com/) | Quiet Luxury tasarım sistemi ve HSL renk tokenları |
| <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Framer-Dark.svg" width="22" height="22" alt="Framer Motion" /> | [Framer Motion](https://www.framer.com/motion/) | GPU hızlandırmalı animasyonlar ve yay dinamikleri |
| <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Capacitor-Dark.svg" width="22" height="22" alt="Capacitor" /> | [Capacitor](https://capacitorjs.com/) | Android ve iOS native mobil kabuk platformu |
| <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/AndroidStudio-Dark.svg" width="22" height="22" alt="Android" /> | [Android Studio / Gradle](https://developer.android.com/) | Target SDK 36, APK / AAB paketleme ve Android donanımı |
| <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/Apple-Dark.svg" width="22" height="22" alt="iOS" /> | [Apple Xcode / iOS](https://developer.apple.com/xcode/) | iOS Swift köprüsü, AppIcon, LaunchScreen ve TestFlight |

---

## Proje Mimarisi

```text
kapsule/
├── android/                 # Capacitor Android native projesi (Gradle, Manifest, Mipmap ikonları)
├── ios/                     # Capacitor iOS native projesi (Xcode Workspace, Info.plist, AppIcon)
├── public/                  # Statik varlıklar (logo.png, favicon.svg)
├── scripts/                 # Varlık üretim otomasyonu (generate-icons.js)
├── src/
│   ├── assets/              # Marka varlıkları ve 3D çizimler
│   ├── components/          # Ortak UI bileşenleri (Button, Badge, Card, Toast, PasscodeLock ...)
│   ├── features/            # Ekranlar
│   │   ├── home/            # Kasa özeti, son işlemler, hızlı aksiyonlar
│   │   ├── documents/       # Belge arşivleme ve kategorizasyon
│   │   ├── receipts/        # Fiş tarama, kamera ve iade takvimi
│   │   ├── subscriptions/   # Çekmeceli abonelik kartları ve maliyet projeksiyonu
│   │   ├── warranties/      # Garanti takibi ve bitiş alarmları
│   │   ├── notes/           # Güvenli kişisel notlar
│   │   ├── bookmarks/       # Bağlantı ve yer imleri
│   │   ├── timeline/        # Zaman akışı ve harcama grafikleri
│   │   └── settings/        # Profil, AvatarCropModal, LegalModals, PIN ve tema
│   ├── layouts/             # MainLayout, MobileNav, Sidebar (Safe area uyumlu)
│   ├── services/            # vaultStorage, storageAdapter, nativeBiometrics, nativeShare, nativeCamera
│   ├── styles/              # globals.css (Quiet luxury CSS tokenları)
│   └── types/               # TypeScript tip ve arayüz tanımları
├── capacitor.config.ts      # Capacitor köprü yapılandırması
├── STORE-YAYINLAMA-YOL-HARITASI.md  # Mağaza yayınlama yol haritası ve kontrol listesi
└── MAGAZA-YAYINLAMA-REHBERI.md      # ASO metinleri, ekran görüntüsü ebatları ve yayın rehberi
```

---

## Kurulum ve Çalıştırma

Gereksinimler: **Node.js 18+**

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat (localhost:3000 / 3001)
npm run dev

# Tip kontrolü ve üretim derlemesi
npm run build
```

### Mobil Uygulama Derleme (Capacitor)

```bash
# Web paketini derle ve native platformlara senkronize et
npm run build
npx cap sync

# Android Studio ile aç ve derle
npx cap open android

# Xcode ile aç ve derle (macOS gereklidir)
npx cap open ios
```

---

## Mağaza Yayınlama Rehberleri

- [STORE-YAYINLAMA-YOL-HARITASI.md](STORE-YAYINLAMA-YOL-HARITASI.md) — 5 aşamalı mağaza yayınlama eylem planı.
- [MAGAZA-YAYINLAMA-REHBERI.md](MAGAZA-YAYINLAMA-REHBERI.md) — App Store ve Google Play başlık, açıklama, anahtar kelime ve ekran görüntüsü rehberi.

---

## Lisans ve Gizlilik

Kapsule, kullanıcı gizliliğini en üst düzeyde tutacak şekilde tasarlanmıştır. Tüm veriler yalnızca kullanıcı cihazında depolanır.