from django.shortcuts import render

def root(request):
    return render(request, 'frontend/root.html', {})
