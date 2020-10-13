from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('enrollment/', include('enrollment.urls')),
    path('admin/', admin.site.urls),
]
