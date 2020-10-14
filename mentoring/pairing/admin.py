from django.contrib import admin

from .models import Pair, HistoricalPair

admin.site.register(Pair)
admin.site.register(HistoricalPair)
