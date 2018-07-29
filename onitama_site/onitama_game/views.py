from django.shortcuts import render, get_object_or_404
from django.contrib.sessions.backends.base import UpdateError
from .models import Game

def index(request):
    game_list = Game.objects.all()
    context = {
        'game_list': game_list,
    }
    return render(request, 'onitama_game/index.html', context)

def game(request, game_id):
    game = get_object_or_404(Game, pk=game_id)
    socket_path = '/ws/onitama/game/{}/'.format(game_id)
    try:
        # Need to manually save to ensure Session is stored (will be needed later)
        request.session.save()
    except UpdateError:
        # If Session was deleted from database must issue a new one
        request.session.flush()
        request.session.save()
    return render(
        request,
        'onitama_game/game.html',
        {'game': game, 'socket_path': socket_path}
    )
