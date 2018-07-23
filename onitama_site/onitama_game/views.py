from django.shortcuts import render, get_object_or_404
from .models import Game

def index(request):
    game_list = Game.objects.all()
    context = {
        'game_list': game_list,
    }
    return render(request, 'onitama_game/index.html', context)

def game(request, game_id):
    game = get_object_or_404(Game, pk=game_id)
    socket_url = "ws://localhost:8000/ws/onitama/game/{}/".format(game_id)
    request.session.save() # Need to manually save to ensure Session is stored (will be needed later)
    return render(
        request,
        'onitama_game/game.html',
        {'game': game, 'socket_url': socket_url}
    )
