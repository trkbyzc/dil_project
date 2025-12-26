# Dil Project

Kısa açıklama:
Bu depo, DilPanel tabanlı bir Django web uygulamasını içerir. Uygulama dil öğrenme ve değerlendirme araçları sağlar.

Gereksinimler:
- Python 3.8+
- Bağımlılıkları yüklemek için `pip install -r requirements.txt`

Hızlı başlatma:
1. Sanal ortam oluşturun: `python -m venv venv`
2. Ortamı aktif edin (Windows): `venv\Scripts\Activate`
3. Bağımlılıkları yükleyin: `pip install -r requirements.txt`
4. Veritabanı migrasyonlarını uygulayın: `python manage.py migrate`
5. Geliştirme sunucusunu başlatın: `python manage.py runserver`

Dosya yapısı (özeti):
- `core/` — uygulama kaynak kodu, statik ve template dosyaları
- `DjangoProject/` — proje ayarları
- `requirements.txt` — proje bağımlılıkları

Geliştirici notları:
- `db.sqlite3` dosyası `.gitignore` içinde hariç tutulmuştur; yerel veritabanınızı oluşturun veya sağlanan örnekleri kullanın.
