from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('enrollment/', include('mentoring.enrollment.urls')),
    path('pairing/', include('mentoring.pairing.urls')),
    path('admin/', admin.site.urls),
    path('', include('mentoring.home.urls')),
]
