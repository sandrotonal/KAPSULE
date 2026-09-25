# Kapsule — App Store ve Google Play Store Yayinlama ve ASO Rehberi

Bu rehber, Kapsule uygulamasinin **Apple App Store** ve **Google Play Store** magaza inceleme sureclerinden (App Review) ilk seferde ve sorunsuz gecebilmesi icin gerekli tum magaza metinlerini, gizlilik beyanlarini ve derleme adimlarini icerir.

---

## 1. Apple App Store Connect Yapilandirmasi

### A. Temel Bilgiler
- **Uygulama Adi (App Name):** `Kapsule — Kisisel Dijital Kasa` *(29 karakter)*
- **Alt Baslik (Subtitle):** `Fis, Garanti ve Abonelik Kasasi` *(30 karakter)*
- **Birincil Kategori:** Verimlilik (Productivity)
- **Ikincil Kategori:** Finans (Finance) veya Yardimci Programlar (Utilities)
- **Paket Kimligi (Bundle Identifier):** `com.sandrotonal.kapsule`
- **SKU:** `KAPSULE-IOS-001`
- **Yas Derecelendirmesi (Age Rating):** `4+` (Uygulamada harici icerik, siddet veya kumar yoktur).

### B. App Store ASO ve Aciklama Metinleri

#### Kisa Tanitim Metni (Promotional Text - 170 Karakter):
> Kapsule; fislerinizi, garanti surelerinizi, aboneliklerinizi ve ozel belgelerinizi tek bir cevrimdisi kasada, quiet luxury zarafetiyle guvende tutar.

#### Tam Aciklama (Description):
```text
Kapsule — Onemli olan her sey. Tek bir yerde.

Kapsule; kisisel evraklarinizi, satin alim fislerinizi, urun garantilerinizi, abonelik odemelerinizi ve ozel notlarinizi organize eden, sakin ve zarif bir kisisel dijital kasadir.

Neden Kapsule?

- %100 CEVRIMDISI VE GUVENLI: Verileriniz hicbir zaman uzaktaki bir sunucuya gitmez. Yalnizca telefonunuzun guvenli yerel depolama alaninda (Local Sandbox) barindirilir.
- BIYOMETRIK KORUMA: Face ID, Touch ID veya 4 haneli PIN kodu ile kasanizi merakli gozlerden koruyun.
- KAMERA ILE FIS VE BELGE TARAMA: Fiziksel alisveris fislerini, faturalari ve garanti belgelerini dogrudan kameranizla cekip saniyeler icinde arsivleyin.
- AKILLI GARANTI TAKIBI: Garanti suresinin dolmasina 7 gun kala haberdar olun; haklarinizi ve servis surelerinizi asla kacirmayin.
- CIFT KATMANLI ABONELIK YONETIMI: Spotify, Netflix, bulut depolama gibi tum yinelenen harcamalarinizi interaktif kartlarla takip edin; aylik ve yillik kasa yukunuzu kontrol altinda tutun.
- ZARIF QUIET LUXURY TASARIM: Gozu yormayan monokrom arayuz, akici mikro-animasyonlar ve tam ekran kenardan kenara (edge-to-edge) mobil geometri.
- KOLAY YEDEKLEME VE DISA AKTARMA: Tek dokunusla AirDrop, WhatsApp veya Dosyalar uzerinden sifreli JSON yedeginizi alin veya cihazlar arasinda tasiyin.

Gizlilik Odakli Mimari:
Kapsule hicbir kullanici verisi toplamaz, analiz etmez veya ucuncu taraflarla paylasmaz. Sifir takipci (Zero Tracker) politikasiyla mahremiyetiniz daima korunur.
```

#### Anahtar Kelimeler (Keywords - 100 Karakter):
`kasa,fis saklama,garanti takip,abonelik yonetici,fatura,belge,not,cuzdan,offline vault,makbuz`

### C. Apple Gizlilik Bildirimi (App Privacy - Nutrition Label)
Apple App Store Connect'te yer alan **App Privacy** anketinde su yanitlar verilmelidir:
- **"Do you or your third-party partners collect data from this app?"**  
  -> **HAYIR (No, we do not collect data from this app)**
- **Sonuc:** Uygulamaniz App Store'da en guvenilir etiket olan **"Data Not Collected" (Veri Toplanmaz)** rozetini alir.

### D. App Review (Inceleme Ekibi) Notlari
- **Giris Bilgileri (Sign-In Information):**  
  *"Kapsule bir bulut hesabi veya kayit gerektirmez. Uygulama tamamen yerel calismaktadir. Inceleme icin kullanici adi ve sifreye ihtiyac yoktur. PIN kilidi test edilecekse varsayilan olarak kapalidir veya kullanici diledigi 4 haneli kodu tanimlayabilir."*
- **Kamera Izni Notu:**  
  *"Kamera, kullanicinin fiziksel fis veya garanti belgesi fotografini cihaz ici yerel kasasina ekleyebilmesi amaciyla kullanilmaktadir."*

---

## 2. Google Play Console Yapilandirmasi

### A. Temel Bilgiler
- **Uygulama Adi:** `Kapsule: Kisisel Dijital Kasa`
- **Kisa Aciklama (80 Karakter):**  
  `Fis, garanti, abonelik ve belgeleriniz icin guvenli, cevrimdisi kisisel kasa.`
- **Kategori:** Verimlilik (Productivity)
- **Hedef Kitle:** 18 yas ve uzeri / Herkes

### B. Google Play Veri Guvenligi (Data Safety) Yanitlari
- **Veri Toplama:** Uygulama kullanici verisi **toplamaz**.
- **Veri Paylasimi:** Veriler ucuncu taraflarla **paylasilmaz**.
- **Sifreleme:** Cihaz uzerinde yerel depolama kullanilir.
- **Hesap ve Veri Silme:** Uygulama icinde *Ayarlar > Tum Kayitlari Sifirla* butonuyla tum yerel verilerin aninda kalici olarak silinebildigi belirtilmelidir.

---

## 3. Ekran Goruntuleri ve Gorsel Standartlari

| Platform | Cihaz / Boyut | Gereken Cozunurluk | Onerilen Icerik |
| :--- | :--- | :--- | :--- |
| **iOS (Zorunlu)** | 6.7" iPhone (16 Pro Max / 15 Pro Max) | **1290 x 2796 px** | Ana Sayfa Cuzdani, Cift Katmanli Abonelikler, Fis Kamera ve Detay, Ayarlar ve Guvenlik |
| **iOS (Zorunlu)** | 6.5" iPhone (14 Plus / 11 Pro Max) | **1242 x 2688 px** | Yukaridaki ekranlarin 6.5" boyutu |
| **Android (Zorunlu)** | Telefon (16:9 veya 20:9) | **1080 x 2400 px** | Kasa Ana Ekrani, Garanti Zaman Cizelgesi, Fis Bilet Gorunumu |
| **Google Play (Zorunlu)** | Ozellik Grafigi (Feature Graphic) | **1024 x 500 px** | Monokrom Kapsule logosu ve "Onemli olan her sey. Tek bir yerde." slogani |

---

## 4. Adim Adim Derleme Komutlari

### Android Icin (Release AAB Uretimi):
```bash
# 1. Web projesini derle
npm run build

# 2. Capacitor native projelerini guncelle
npx cap sync

# 3. Android Studio ile ac veya terminalden derle
npx cap open android
```
*(Android Studio'da: **Build > Generate Signed Bundle / APK > Android App Bundle (AAB)** secilerek magaza anahtarinizla imzalanir).*

### iOS Icin (TestFlight ve App Store Gonderimi):
```bash
# 1. Web projesini derle ve senkronize et
npm run build
npx cap sync ios

# 2. Xcode ile ac
npx cap open ios
```
*(Xcode'da: **Signing & Capabilities** altinda Apple Developer Team secilir. Menuden **Product > Archive > Distribute App > App Store Connect** ile TestFlight'a yuklenir).*
