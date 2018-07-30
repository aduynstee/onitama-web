from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.sessions.backends.base import UpdateError
from django.contrib.sessions.models import Session
from .models import Game, Player

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
        {'socket_path': socket_path}
    )

def new(request):
    try:
        # Need to manually save to ensure Session is stored (will be needed later)
        request.session.save()
    except UpdateError:
        # If Session was deleted from database must issue a new one
        request.session.flush()
        request.session.save()
    session = Session.objects.get(pk=request.session.session_key)
    game = Game.create()
    game.add_player(session)
    return redirect('game', game_id=game.id)
