from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
import os


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('core.urls')),  # ← core uygulamasının URL'lerini bağla

]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
    
    # CSS ve JS dosyaları için özel MIME type ayarları
    from django.http import HttpResponse
    from django.views.decorators.http import require_http_methods
    
    def serve_css(request, path):
        file_path = os.path.join(settings.STATICFILES_DIRS[0], 'css', path)
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return HttpResponse(content, content_type='text/css')
        return HttpResponse(status=404)
    
    def serve_js(request, path):
        file_path = os.path.join(settings.STATICFILES_DIRS[0], 'js', path)
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return HttpResponse(content, content_type='application/javascript')
        return HttpResponse(status=404)
    
    urlpatterns += [
        path('static/css/<str:path>', serve_css),
        path('static/js/<str:path>', serve_js),
    ]
