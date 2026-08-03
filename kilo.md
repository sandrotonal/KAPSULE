Kanka bence uygulamanın yönü doğru: “kişisel dijital kasa” hissi var, tasarım dokümanların da çok net bir karakter çizmiş. Ama şu an app bazı yerlerde hala “güzel yapılmış arşiv uygulaması” seviyesinde. Bir üst kaliteye çıkması için odağı “saklama”dan “hayatımı düzenliyor ve bana güven veriyor” hissine taşımalıyız.

Bence sıradaki güncellemeler şöyle olmalı.

Ana Eksik Şu an en büyük eksik: Home ekranı dokümanlarda yazdığın vizyona tam uymuyor.

06-screenblueprints.md diyor ki Home:

Dashboard olmamalı.
İlk blok “Continue where you left off” olmalı.
Bugün önemli olan şeyleri göstermeli.
Recent activity minimal olmalı.
Search birinci sınıf aksiyon olmalı.
Mevcut Home’da güzel kartlar var ama biraz “stats / dashboard” tarafına yaklaşıyor:

Aylık Harcama
Aktif Garantiler
Koleksiyon sayıları
Arşiv özeti
Bunlar kötü değil ama 03-antipatterns.md dosyasında “metrics, statistics, dashboard, big numbers” kesinlikle kaçınılması gereken şeyler olarak geçiyor. Bu yüzden Home’u biraz daha “premium kişisel devam ekranı” yapmalıyız.

1. Home’u Yeniden Konumlandırma Bence ilk büyük güncelleme bu olmalı.

Home yapısı şöyle olmalı:

Üst alan: Günaydın Bugün ilgilenmen gereken 2 şey var. gibi sakin bir cümle.
Büyük search alanı: Arama Home’da daha görünür olmalı. Sidebar’daki search yeterli değil. Home içinde geniş, sakin bir search trigger olmalı: Ne arıyorsun? Pasaport, garanti, fiş...
Devam Et bölümü: Son açılan veya son eklenen maksimum 5 öğe: Pasaport kopyası MacBook garanti Spotify aboneliği Apple Store fişi
Dikkat Gerekenler: Sadece gerçek veri varsa: MacBook garantisi 42 gün içinde bitiyor. Netflix aboneliği 3 gün içinde yenileniyor. Pasaport tarihi yaklaşıyor.
Koleksiyonlar: Şu anki gibi kalabilir ama daha sakin, daha az renkli, daha az “tile” hissinde.
En alt: Boşluk. Dokümanın dediği gibi “leave breathing room”.
Bu güncelleme app’in karakterini en çok yükseltir.

2. “Intelligent Organization” Katmanı 13-product-principles.md içinde en önemli cümlelerden biri şu: Kapsule does not store files. Kapsule organizes lives.

Şu an app daha çok verileri kategorilerde gösteriyor. Bir sonraki kalite seviyesi: app’in kullanıcı yerine düşünmesi.

Eklenebilecek akıllı düzenleme fikirleri:

Garanti bitiş uyarıları
Abonelik yenileme uyarıları
Fişten garanti ilişkisi önerisi
Belge kategorisini otomatik tahmin etme
“Bugün önemli” listesi
“Yakında bitecekler” bölümü
“Eksik bilgi” uyarısı: garanti var ama fiş bağlı değil
“Bu ürünün seri numarası eksik” gibi sakin öneriler
Bu özellikler ürünün ruhuna çok uygun çünkü kullanıcıya yük bindirmiyor.

3. Detail Modal Kalitesi Detay modalları şu an işlevsel ama premium ürün hissinde biraz daha iyileştirilebilir.

Her detay ekranında aynı düzen olmalı:

Büyük önizleme / kimlik alanı
Ana bilgi
İkincil metadata
İlişkili öğeler
En altta sakin aksiyonlar
Özellikle:

Document Detail
Warranty Detail
Subscription Detail
Bookmark Detail
Receipt Detail
Bunlarda kopya dili, spacing, section başlıkları tamamen aynı sisteme çekilmeli.

Örnek kalite hedefi: Garanti Detayı sadece bilgi göstermemeli, kullanıcıya güven vermeli:

Durum: Aktif
Kalan süre: 214 gün
Bağlı fiş: Apple Store fişi
Seri numarası: kopyala
Notlar
Sil / Tamam
4. Search Deneyimi Search app’in ana özelliği olmalı. Dokümanda da böyle yazıyor.

Şu an SearchModal güzel ama biraz fazla görsel efektli. 03-antipatterns.md içinde “gradient backgrounds, glassmorphism, blur for decoration” overuse uyarısı var. Search orb hoş ama Kapsule’ın “calm, premium, invisible” ruhuna göre biraz fazla dekoratif kalabilir.

Bence Search güncellemesi:

Daha sade, daha Apple/Raycast karışımı bir search modal
Daha net placeholder
Son aramalar
Hızlı arama önerileri
Kategoriye göre sonuç gruplama
Klavyede ok tuşlarıyla sonuç seçme
Enter ile açma
Escape ile kapama
Bu çok ciddi kalite artışı sağlar.

5. Copywriting Tutarlılığı 09-copywritingguide.md çok iyi ama app içinde hala karışık dil var:

Bazı yerler İngilizceydi, bir kısmını düzelttik.
Bazı kategoriler Tech, Home, Travel gibi İngilizce.
Bazı butonlar kısa ama bağlam eksik.
Bazı boş durumlar güzel, bazıları daha zayıf.
Yapılacak:

Tüm kullanıcı metinlerini Türkçeye çekmek
Teknik kelimeleri azaltmak
“Kaydet / Aç / Tamam / Sil / İptal” standardı
Boş durumları aynı kaliteye getirmek
Hata ve başarı mesajları için küçük toast sistemi
Bu uygulamanın “marka kişiliğini” çok toparlar.

6. Toast / Feedback Sistemi Şu an bazı aksiyonlar oluyor ama kullanıcı her zaman “ne oldu?” hissini net almıyor.

Eklenmeli:

Kaydedildi.
Silindi.
Favorilere eklendi.
Seri numarası kopyalandı.
Abonelik duraklatıldı.
Ama loud değil. Çok sakin, küçük, altta veya sağ altta.

Bu 04-uxconstitution.md içindeki “Success should be subtle” prensibine uyuyor.

7. Motion Sadeleştirme 07-motionconstitution.md net:

Motion açıklamalı olmalı.
Dekoratif olmamalı.
500ms üstüne çıkmamalı.
Bouncy olmamalı.
Şu an bazı TiltCard / hover / gradient / blob efektleri güzel ama fazla kullanılırsa “premium kasa” yerine “showcase UI” hissi verebilir.

Bence yapılacak:

TiltCard kullanımını azaltmak
Search orb efektini sadeleştirmek
Kart hover scale değerlerini biraz sakinleştirmek
Page transition aynı kalsın
Modal transition iyi
Liste giriş animasyonları iyi ama delay fazla büyümemeli
En kaliteli ürünler genelde daha az hareket eder.

8. Settings Ekranı Settings şu an bakmadığımız ama muhtemelen çok önemli ekranlardan biri. Çünkü Privacy is default prensibi var.

Settings içinde olması gerekenler:

Güvenlik
Otomatik kilit
Şifre değiştirme
Tema
Veri yönetimi
Export
Reset
Gizlilik açıklaması
Onboarding’i tekrar göster
Ama teknik değil, insani dille.

Örnek: Güvenlik Kapsule açıldığında şifre istensin.

Veriler Kayıtlarını dışa aktar veya kasayı sıfırla.

9. Onboarding İyileştirme Onboarding varsa, ürün vizyonunu iyi anlatmalı:

“Her şey tek yerde”
“Aramak, klasörlerden hızlıdır”
“Önemli tarihleri kaçırma”
“Kasan sana ait”
Ama pazarlama gibi değil. Sakin, kısa, premium.

Onboarding sonunda kullanıcıdan ilk aksiyon:

İlk belgeyi ekle
Bir garanti ekle
Daha sonra
10. Data Model ve Gerçek Ürün Hazırlığı Engineering dokümanında Supabase, React Hook Form, Zod, TanStack Query geçiyor. Şu an localStorage üzerinden ilerliyor gibi. Demo için tamam ama ürünleşme için eksik.

Sıradaki teknik kalite aşamaları:

Zod schema’ları
React Hook Form ile QuickAdd yeniden düzenleme
VaultStorageService tip güvenliği
LocalStorage adapter yapısı
İleride Supabase adapter’a geçiş
Export/import JSON
Veri versiyonlama
Basit migration sistemi
Bu UI’yı bozmaz, ama app’i ciddi ürün haline getirir.

11. Gerçek “Kapsule” Özelliği: Relationships Bence app’i sıradan kasa uygulamalarından ayıracak özellik bu olur.

Örnek ilişkiler:

Fiş -> Garanti
Belge -> Not
Abonelik -> Fiş
Bookmark -> Not
Garanti -> Ürün seri numarası
Belge -> Son geçerlilik tarihi
UI’da küçük “Linked items” bölümü olabilir: Bağlı kayıtlar Apple Store fişi MacBook garanti notu

Bu çok premium hissettirir çünkü app sadece saklamıyor, anlam kuruyor.

12. En Öncelikli Yol Haritası Ben olsam şu sırayla giderdim:

Home redesign: Search + Continue + Attention + sakin Collections.
SearchModal sadeleştirme: Keyboard navigation, grouped results, recent searches.
Copy audit: Tüm İngilizce/teknik metinleri temizleme.
Detail modal standardizasyonu: Tüm detay ekranları aynı premium yapıya çekilsin.
Toast sistemi: Sakin feedback.
Relationships: Fiş-garanti, abonelik-fiş, belge-not bağlantıları.
QuickAdd form refactor: Zod + React Hook Form + daha kısa progressive form.
Settings polish: Privacy/security/data management.
Motion cleanup: Tilt/gradient/blur overuse azaltma.
Supabase-ready architecture: Local adapter korunur, ileride backend kolay bağlanır.
Benim Net Görüşüm Kanka app’in en büyük potansiyeli “daha çok özellik eklemek” değil. Tam tersi: mevcut özellikleri daha sakin, daha akıllı ve daha bütünlüklü yapmak.

Şu an yapılması gereken en doğru hamle: HomeScreeni dokümanlarda yazdığın vizyona göre yeniden şekillendirmek.

Çünkü kullanıcı app’i açınca ilk his orada oluşuyor. Home “dashboard” gibi hissetmezse, Kapsule’ın premium karakteri hemen oturur.

Sonraki en mantıklı çalışma paketi:

Home redesign
Search sadeleştirme
Attention/Continue section
Copy polish
Bu paket app’i görsel olarak bozmadan kalite hissini en çok yükseltir.