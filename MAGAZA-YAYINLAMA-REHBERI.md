# 📱 Kapsüle — App Store & Google Play Store Yayınlama ve ASO Rehberi

Bu rehber, Kapsüle uygulamasının **Apple App Store** ve **Google Play Store** mağaza inceleme süreçlerinden (App Review) ilk seferde ve sorunsuz geçebilmesi için gerekli tüm mağaza metinlerini, gizlilik beyanlarını ve derleme adımlarını içerir.

---

## 1. 🍎 Apple App Store Connect Yapılandırması

### A. Temel Bilgiler
- **Uygulama Adı (App Name):** `Kapsüle — Kişisel Dijital Kasa` *(29 karakter)*
- **Alt Başlık (Subtitle):** `Fiş, Garanti & Abonelik Kasası` *(30 karakter)*
- **Birincil Kategori:** Verimlilik (Productivity)
- **İkincil Kategori:** Finans (Finance) veya Yardımcı Programlar (Utilities)
- **Paket Kimliği (Bundle Identifier):** `com.sandrotonal.kapsule`
- **SKU:** `KAPSULE-IOS-001`
- **Yaş Derecelendirmesi (Age Rating):** `4+` (Uygulamada harici içerik, şiddet veya kumar yoktur).

### B. App Store ASO ve Açıklama Metinleri

#### Kısa Tanıtım Metni (Promotional Text - 170 Karakter):
> Kapsüle; fişlerinizi, garanti sürelerinizi, aboneliklerinizi ve özel belgelerinizi tek bir çevrimdışı kasada, quiet luxury zarafetiyle güvende tutar.

#### Tam Açıklama (Description):
```text
Kapsüle — Önemli olan her şey. Tek bir yerde.

Kapsüle; kişisel evraklarınızı, satın alım fişlerinizi, ürün garantilerinizi, abonelik ödemelerinizi ve özel notlarınızı organize eden, sakin ve zarif bir kişisel dijital kasadır.

Neden Kapsüle?

• %100 ÇEVRİMDIŞI & GÜVENLİ: Verileriniz hiçbir zaman uzaktaki bir sunucuya gitmez. Yalnızca telefonunuzun güvenli yerel depolama alanında (Local Sandbox) barındırılır.
• BİYOMETRİK KORUMA: Face ID, Touch ID veya 4 haneli PIN kodu ile kasanızı meraklı gözlerden koruyun.
• KAMERA İLE FİŞ & BELGE TARAMA: Fiziksel alışveriş fişlerini, faturaları ve garanti belgelerini doğrudan kameranızla çekip saniyeler içinde arşivleyin.
• AKILLI GARANTİ TAKİBİ: Garanti süresinin dolmasına 7 gün kala haberdar olun; haklarınızı ve servis sürelerinizi asla kaçırmayın.
• ÇİFT KATMANLI ABONELİK YÖNETİMİ: Spotify, Netflix, bulut depolama gibi tüm yinelenen harcamalarınızı interaktif kartlarla takip edin; aylık ve yıllık kasa yükünüzü kontrol altında tutun.
• ZARİF QUIET LUXURY TASARIM: Gözü yormayan monokrom arayüz, akıcı mikro-animasyonlar ve tam ekran kenardan kenara (edge-to-edge) mobil geometri.
• KOLAY YEDEKLEME & DIŞA AKTARMA: Tek dokunuşla AirDrop, WhatsApp veya Dosyalar üzerinden şifreli JSON yedeğinizi alın veya cihazlar arasında taşıyın.

Gizlilik Odaklı Mimari:
Kapsüle hiçbir kullanıcı verisi toplamaz, analiz etmez veya üçüncü taraflarla paylaşmaz. Sıfır takipçi (Zero Tracker) politikasıyla mahremiyetiniz daima korunur.
```

#### Anahtar Kelimeler (Keywords - 100 Karakter):
`kasa,fiş saklama,garanti takip,abonelik yönetici,fatura,belge,not,cüzdan,offline vault,makbuz`

### C. Apple Gizlilik Bildirimi (App Privacy - Nutrition Label)
Apple App Store Connect'te yer alan **App Privacy** anketinde şu yanıtlar verilmelidir:
- **"Do you or your third-party partners collect data from this app?"**  
  👉 **HAYIR (No, we do not collect data from this app)**
- **Sonuç:** Uygulamanız App Store'da en güvenilir ve prestijli etiket olan **"Data Not Collected" (Veri Toplanmaz)** rozetini alır.

### D. App Review (İnceleme Ekibi) Notları
- **Giriş Bilgileri (Sign-In Information):**  
  *"Kapsüle bir bulut hesabı veya kayıt gerektirmez. Uygulama tamamen yerel çalışmaktadır. İnceleme için kullanıcı adı ve şifreye ihtiyaç yoktur. PIN kilidi test edilecekse varsayılan olarak kapalıdır veya kullanıcı dilediği 4 haneli kodu tanımlayabilir."*
- **Kamera İzni Notu:**  
  *"Kamera, kullanıcının fiziksel fiş veya garanti belgesi fotoğrafını cihaz içi yerel kasasına ekleyebilmesi amacıyla kullanılmaktadır."*

---

## 2. 🤖 Google Play Console Yapılandırması

### A. Temel Bilgiler
- **Uygulama Adı:** `Kapsüle: Kişisel Dijital Kasa`
- **Kısa Açıklama (80 Karakter):**  
  `Fiş, garanti, abonelik ve belgeleriniz için güvenli, çevrimdışı kişisel kasa.`
- **Kategori:** Verimlilik (Productivity)
- **Hedef Kitle:** 18 yaş ve üzeri / Herkes

### B. Google Play Veri Güvenliği (Data Safety) Yanıtları
- **Veri Toplama:** Uygulama kullanıcı verisi **toplamaz**.
- **Veri Paylaşımı:** Veriler üçüncü taraflarla **paylaşılmaz**.
- **Şifreleme:** Cihaz üzerinde yerel depolama kullanılır.
- **Hesap & Veri Silme:** Uygulama içinde *Ayarlar > Tüm Kayıtları Sıfırla* butonuyla tüm yerel verilerin anında kalıcı olarak silinebildiği belirtilmelidir.

---

## 3. 🎨 Ekran Görüntüleri ve Görsel Standartları

| Platform | Cihaz / Boyut | Gereken Çözünürlük | Önerilen İçerik |
| :--- | :--- | :--- | :--- |
| **iOS (Zorunlu)** | 6.7" iPhone (16 Pro Max / 15 Pro Max) | **1290 x 2796 px** | Ana Sayfa Cüzdanı, Çift Katmanlı Abonelikler, Fiş Kamera & Detay, Ayarlar & Güvenlik |
| **iOS (Zorunlu)** | 6.5" iPhone (14 Plus / 11 Pro Max) | **1242 x 2688 px** | Yukarıdaki ekranların 6.5" boyutu |
| **Android (Zorunlu)** | Telefon (16:9 veya 20:9) | **1080 x 2400 px** | Kasa Ana Ekranı, Garanti Zaman Çizelgesi, Fiş Bilet Görünümü |
| **Google Play (Zorunlu)** | Özellik Grafiği (Feature Graphic) | **1024 x 500 px** | Monokrom Kapsüle logosu ve "Önemli olan her şey. Tek bir yerde." sloganı |

---

## 4. 🛠️ Adım Adım Derleme Komutları

### Android İçin (Release AAB Üretimi):
```bash
# 1. Web projesini derle
npm run build

# 2. Capacitor native projelerini güncelle
npx cap sync

# 3. Android Studio ile aç veya terminalden derle
npx cap open android
```
*(Android Studio'da: **Build > Generate Signed Bundle / APK > Android App Bundle (AAB)** seçilerek mağaza anahtarınızla imzalanır).*

### iOS İçin (TestFlight & App Store Gönderimi):
```bash
# 1. Web projesini derle ve senkronize et
npm run build
npx cap sync ios

# 2. Xcode ile aç
npx cap open ios
```
*(Xcode'da: **Signing & Capabilities** altında Apple Developer Team seçilir. Menüden **Product > Archive > Distribute App > App Store Connect** ile TestFlight'a yüklenir).*
