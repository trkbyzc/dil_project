# Railway Deployment Guide

Bu proje Railway platformunda deploy edilmek üzere hazırlanmıştır.

## Deployment Adımları

### 1. Railway Hesabı Oluşturun
- https://railway.app adresine gidin
- GitHub hesabınızla giriş yapın

### 2. Proje Yükleyin
- GitHub'da yeni bir repository oluşturun
- Bu projeyi GitHub'a push edin
- Railway'de "Deploy from GitHub repo" seçin

### 3. Environment Variables Ekleyin
Railway dashboard'ında Variables sekmesine gidin ve şunları ekleyin:

```
SECRET_KEY=django-insecure-fau$b0c+oxcg15*dl+x9^cbi!%@9vkl#n74$lp9reo!5-$cuh2
DEBUG=False
RAILWAY_ENVIRONMENT=production
GEMINI_API_KEY=your-actual-gemini-api-key-here
```

### 4. PostgreSQL Database Ekleyin
- Railway dashboard'ında "Add Service" → "Database" → "PostgreSQL"
- DATABASE_URL otomatik olarak eklenecek

### 5. Deploy
- Railway otomatik olarak deploy edecek
- Build loglarını takip edin

## Önemli Notlar

- `SECRET_KEY` değerini mutlaka değiştirin
- `GEMINI_API_KEY` değerini gerçek API key'iniz ile değiştirin
- Static files WhiteNoise ile serve edilecek
- Database PostgreSQL kullanacak (production'da)

## Sorun Giderme

Eğer deployment sırasında hata alırsanız:
1. Build loglarını kontrol edin
2. Environment variables'ların doğru olduğunu kontrol edin
3. requirements.txt'deki tüm paketlerin yüklendiğini kontrol edin
