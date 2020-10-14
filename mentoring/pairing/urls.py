from django.urls import path

from . import views

urlpatterns = [
    path('', views.main, name='main'),
    path('pair', views.make_pair, name='make-pair'),
]
