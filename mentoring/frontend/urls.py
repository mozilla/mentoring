from django.urls import re_path

from . import views

urlpatterns = [
    # render the same view for any URL; the react router sorts it out
    re_path('.*', views.root, name='root'),
]
