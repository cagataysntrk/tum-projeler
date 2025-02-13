# Upcyman Projesi Analizi ve Raporu

Bu rapor, Upcyman projesinin kaynak kodlarının ve yapısının detaylı bir analizini içermektedir. Proje, bir backend ve frontend içeren modern bir web uygulaması olarak geliştirilmiştir.

## Backend

Backend, Node.js ve Express kullanılarak geliştirilmiş bir REST API'dir. Veritabanı olarak MongoDB kullanılmaktadır. Kaynak kodları `backend/src` klasöründe yer almaktadır.

### Teknolojiler ve Paketler
- Express: Web framework
- Mongoose: MongoDB ODM 
- JWT (jsonwebtoken): Kullanıcı kimlik doğrulama
- Bcrypt: Şifre hashleme
- TypeScript: Kod yazımı
- Nodemon: Geliştirme aşamasında otomatik yeniden başlatma
- Helmet: Güvenlik headers'ları
- Cors: Cross-origin kaynak paylaşımı
- Morgan: HTTP request logger

### Klasör Yapısı
- `controllers`: Route handler fonksiyonları
- `routes`: API endpoint tanımları 
- `models`: Mongoose modelleri
- `middleware`: Custom middleware fonksiyonları
- `config`: Yapılandırma dosyaları
- `utils`: Yardımcı fonksiyonlar
- `scripts`: Yardımcı scriptler (ör. süper admin oluşturma)

### Ana Dosyalar
- `app.ts`: Express uygulamasının yapılandırıldığı ve başlatıldığı ana dosya. Middleware'leri, route'ları ekler ve MongoDB bağlantısını sağlar.

## Frontend 

Frontend, Next.js ve React kullanılarak geliştirilmiş modern bir web uygulamasıdır. Kaynak kodları `frontend/src` klasöründe yer almaktadır.

### Teknolojiler ve Paketler
- Next.js: React framework
- React: UI kütüphanesi
- TypeScript: Kod yazımı 
- Tailwind CSS: Utility-first CSS framework
- Radix UI: Unstyled ve erişilebilir UI bileşenleri
- Lucide: Simge kütüphanesi
- React Hook Form: Form yönetimi
- Recharts, Chart.js: Grafikler
- React Day Picker: Tarih seçici
- React Dropzone: Dosya yükleme
- js-cookie: Cookie yönetimi
- ESLint: Kod kalitesi

### Klasör Yapısı
- `app`: Next.js 13 App Directory yapısı
- `components`: React bileşenleri
- `lib`: Yardımcı kütüphaneler ve fonksiyonlar
- `contexts`: React context'leri
- `types`: TypeScript tipleri

### Ana Dosyalar
- `middleware.ts`: Next.js middleware dosyası. Kimlik doğrulama kontrolü yapar ve yönlendirmeleri gerçekleştirir.

## Genel Bakış

Proje, iyi yapılandırılmış ve endüstri standartlarına uygun teknolojiler kullanılarak geliştirilmiştir. Backend ve frontend ayrı klasörlerde geliştirilerek, ölçeklenebilirlik ve bakım kolaylığı sağlanmıştır. 

Backend, güçlü bir REST API sağlarken, frontend modern ve kullanıcı dostu bir arayüz sunmaktadır. Proje, TypeScript kullanarak kod kalitesini ve güvenliğini artırmaktadır.

Bağımlılık yönetimi için npm kullanılmaktadır. Popüler ve güncel paketler tercih edilerek, projenin stabilitesi ve güvenliği sağlanmaktadır.

Genel olarak, Upcyman projesi sağlam bir mimari ve iyi kodlama pratikleri üzerine inşa edilmiş, modern web teknolojilerini kullanan başarılı bir uygulamadır.
