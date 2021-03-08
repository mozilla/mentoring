from django.urls import re_path, path

from . import views

urlpatterns = [
    path('settings.js', views.settings),
    # render the same view for any URL; the react router sorts it out
    re_path('.*', views.root, name='root'),
]
