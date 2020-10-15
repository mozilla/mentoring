from django.contrib import admin

from .models import Pair, HistoricalPair

class PairAdmin(admin.ModelAdmin):
  list_display = ('mentor', 'learner', 'pair_id')

admin.site.register(Pair, PairAdmin)

class HistoricalPairAdmin(admin.ModelAdmin):
  list_display = ('pair_id',)

admin.site.register(HistoricalPair, HistoricalPairAdmin)
