# Gemini API Setup for AI Roleplay

Bu proje AI roleplay özelliği için Google Gemini API kullanmaktadır.

## Kurulum Adımları

### 1. Gemini API Key Alın
1. [Google AI Studio](https://makersuite.google.com/app/apikey) adresine gidin
2. Google hesabınızla giriş yapın
3. "Create API Key" butonuna tıklayın
4. API key'inizi kopyalayın

### 2. Environment Variable Ayarlayın

#### Windows (PowerShell):
```powershell
$env:GEMINI_API_KEY="your-api-key-here"
```

#### Windows (Command Prompt):
```cmd
set GEMINI_API_KEY=your-api-key-here
```

#### Linux/Mac:
```bash
export GEMINI_API_KEY="your-api-key-here"
```

### 3. Django Sunucusunu Başlatın
```bash
python manage.py runserver
```

### 4. AI Roleplay'i Test Edin
1. Tarayıcınızda `http://localhost:8000/ai-roleplay/` adresine gidin
2. Seviyenizi seçin (A1, A2, B1, B2, C1, C2)
3. Roleplay konusunu yazın
4. "Roleplay'i Başlat" butonuna tıklayın
5. Gemini AI ile konuşmaya başlayın!

## Özellikler

- **Seviye Bazlı Öğrenme**: A1'den C2'ye kadar tüm seviyeler desteklenir
- **Özelleştirilebilir Konular**: İstediğiniz roleplay senaryosunu yazabilirsiniz
- **Gerçek Zamanlı Chat**: Gemini AI ile anlık konuşma
- **Seviyeye Uygun Dil**: AI seçilen seviyeye göre uygun kelime ve gramer kullanır

## Güvenlik Notları

- API key'inizi asla kod içinde saklamayın
- Production ortamında environment variable kullanın
- API key'inizi güvenli tutun ve paylaşmayın 