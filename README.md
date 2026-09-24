# Kapsule

![Kapsule](logo/kaps%C3%BCle-logo.png)

Everything important. One place.

Kapsule, önemli her şeyi tek bir kasa altında toplayan kişisel dijital kasa uygulamasıdır. Belgeler, fişler, abonelikler, garantiler, notlar ve yer imleri — hepsi tek bir yerden, güvenli ve şık bir arayüzle yönetilir. React + Capacitor ile geliştirilip Android ve iOS mağazalarında yayınlanmaya hazır hale getirilmiştir.

---

## Özellikler

- **Belgeler** — Kimlik, finans, sigorta, araç, sağlık ve iş evraklarını kategorize ederek sakla
- **Fişler** ve **iade takvimi** — Harcama geçmişini takip et, önizlemeli fiş görünümü
- **Abonelikler (Slide-Out Çekmece Mimarisi)** — Çift katmanlı etkileşimli kartlar, tek tıkla açılıp kapanan detay tepsisi, yıllık projeksiyon ve sıradaki ödeme sayaçları
- **Garantiler** — Cihaz ve ürün garantilerini, bitiş tarihi yaklaşanları izle
- **İnteraktif Cüzdan (WalletCard)** — Fiziksel kart cebi hissi, kartlar arası akıcı geçiş animasyonu
- **Notlar** ve **yer imleri** — Önemli bilgileri ve bağlantıları topla
- **Zaman Akışı** — İade takvimi ve sektör dağılımı grafikleriyle geçmişi görselleştir
- **Global Arama** — `Ctrl+K` / `Cmd+K` ile kasadaki her şeyi anında bul
- **Quiet Luxury Tasarım Felsefesi** — Saf monokrom renk paleti, arka plansız (floating) minimalist ikonlar ve havadar cam efektleri
- **Ultra Akıcı Sayfa Geçişleri (Zero-Jank)** — 0ms tepki süreli, GPU hızlandırmalı 180ms mikro geçişler; 60/120 FPS donanım hızlandırmalı kart fiziği
- **Kalıcı Depolama & Hibrit Senkronizasyon** — Native Capacitor Preferences ve LocalStorage arasında cold-start otomatik senkronizasyon
- **Passcode Kilidi** — Kasanı kişisel PIN ile koru
- **Onboarding** — İlk açılışta uygulamayı adım adım tanıtan karşılama akışı
- **Dark Mode** — Tam uyumlu açık/koyu tema desteği
- **Haptics** — Dokunsal geri bildirim ile premium kullanım hissi

---

## Teknolojiler

| Teknoloji | Amaç |
|---|---|
| [React 18](https://react.dev/) | Kullanıcı arayüzü |
| [TypeScript](https://www.typescriptlang.org/) | Tip güvenli geliştirme |
| [Vite](https://vite.dev/) | Build ve dev sunucusu |
| [Tailwind CSS](https://tailwindcss.com/) | Stil ve tasarım sistemi |
| [Framer Motion](https://www.framer.com/motion/) | Animasyon ve mikro etkileşimler |
| [Lucide React](https://lucide.dev/) | İkon seti |
| [TanStack Query](https://tanstack.com/query) | Veri yönetimi ve önbellekleme |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | Formlar ve doğrulama |
| [Capacitor](https://capacitorjs.com/) | Native mobil kabuk (Android / iOS) |
| [Capacitor Preferences](https://capacitorjs.com/docs/apis/preferences) | Kalıcı cihaz depolaması |
| [Capacitor Haptics](https://capacitorjs.com/docs/apis/haptics) | Dokunsal geri bildirim |
| [Capacitor Status Bar](https://capacitorjs.com/docs/apis/status-bar) | Status bar yönetimi |

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=fff)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=fff)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=fff)
![Lucide](https://img.shields.io/badge/Lucide-E74C3C?style=for-the-badge&logo=lucide&logoColor=fff)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=fff)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=fff)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=fff)
![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=fff)

---

## Proje Yapısı

```text
src/
├── components/          # Ortak UI bileşenleri (Button, Card, Modal, Toast, WalletCard ...)
│   ├── common/          # PasscodeLock, QuickAddModal
│   └── ui/              # TiltCard, badge, ticket görünümleri, grafikler
├── features/            # Ekranlar (home, documents, receipts, subscriptions, warranties ...)
├── layouts/             # MainLayout, MobileNav, Sidebar
├── services/            # vaultStorage, storageAdapter (Capacitor/Web uyumlu)
├── lib/                 # utils, motion
├── utils/               # haptics
├── styles/              # globals.css
└── types/               # Tip tanımları
android/                 # Capacitor Android native projesi
```

---

## Kurulum ve Çalıştırma

Gereksinimler: Node.js 18+

```bash
# Bağımlılıkları kur
npm install

# Geliştirme sunucusunu başlat (localhost:3000)
npm run dev

# Telefon ile aynı ağdan erişim için (host: true)
# Terminalde görünen Network adresini telefonda aç
```

### Native uygulama (Capacitor)

```bash
# Web uygulamasını build et ve native projeye senkronize et
npm run build
npx cap sync

# Android Studio'da aç
npx cap open android
```

---

## Branch Stratejisi

- `master` — Stabil ve çalışan sürüm
- `son-hal` — Geliştirme devam sürümü
- `ticket-gorunumleri` — Aktif özellik branch'i

Yeni özellikler ayrı branch'lerde geliştirilir ve kullanılabilir hale gelince `master`'a birleştirilir.

---

## Dökümantasyon

[GELISTIRME-PLANI.md](GELISTIRME-PLANI.md) — Web uygulamasından mobil uygulamaya geçiş ve geliştirme yol haritası.

Ürün vizyonundan tasarım diline kadar tüm kararlar şu dökümanlarda toplanır:

01 Product Vision · 02 Visual Design · 03 Anti Patterns · 04 UX Constitution · 05 Design System · 06 Screen Blueprints · 07 Motion Constitution · 08 Engineering Constitution · 09 Copywriting Guide · 10 AI Master Prompt · 11 Reference Analysis · 12 Brand Personality · 13 Product Principles

---

## Teşekkürler

Bu proje [gucluyumhe] https://gucluyumhe.dev/) tarafından geliştirilmektedir.
