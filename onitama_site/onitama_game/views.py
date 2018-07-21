from django.shortcuts import render
from .models import Game

def index(request):
    game_list = Game.objects.all()
    context = {
        'game_list': game_list,
    }
    return render(request, 'onitama_game/index.html', context)

def session(request, username):
    return render(request, 'onitama_game/sessiontest.html', {"username": username})
