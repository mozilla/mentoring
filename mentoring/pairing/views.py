import json

from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.http import require_http_methods

from ..participants.models import Participant
from .models import Pair, HistoricalPair


def main(request):
    context = {}
    # TODO: filter paired people
    context['mentors'] = Participant.objects.all().filter(role=Participant.MENTOR)
    context['learners'] = Participant.objects.all().filter(role=Participant.LEARNER)
    return render(request, 'pairing/main.html', context)


@require_http_methods(["POST"])
def make_pair(request):
    ok = True

    if request.POST.get('mentor'):
        mentor = Participant.objects.get(pk=request.POST['mentor'])
    else:
        messages.error(request, 'No mentor selected')
        ok = False

    if request.POST.get('learner'):
        learner = Participant.objects.get(pk=request.POST['learner'])
    else:
        messages.error(request, 'No learner selected')
        ok = False

    if ok:
        pair = Pair(learner=learner, mentor=mentor)
        if HistoricalPair.already_paired(pair):
            messages.error(request, 'Pairing has already been made')
            ok = false

    if ok:
        pair.save()
        HistoricalPair.record_pairing(pair)
        messages.success(request, f'Pair {pair} added')

    return redirect('main')
