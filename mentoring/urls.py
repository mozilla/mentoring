from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('enrollment/', include('mentoring.enrollment.urls')),
    path('admin/', admin.site.urls),
    path('', include('mentoring.home.urls')),
]
