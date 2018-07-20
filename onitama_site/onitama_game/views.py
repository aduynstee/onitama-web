from django.shortcuts import render

def index(request):
    return render(request, 'onitama_game/index.html', {})
