from django.http import HttpResponse

def webhook(request):
    return HttpResponse("Hello, world. You're at the enrollment index.")
