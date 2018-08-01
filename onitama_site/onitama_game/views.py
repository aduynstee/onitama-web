import json
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.sessions.backends.base import UpdateError
from django.contrib.sessions.models import Session
from django.views.decorators.http import require_POST
from .models import Game, Player, GuestUser

def index(request):
    game_list = Game.objects.all()
    query = GuestUser.objects.filter(session__pk=request.session.session_key)
    if query.exists():
        username = query.first().username
        no_name = False
    else:
        username = "guest"
        no_name = True
    context = {
        'game_list': game_list,
        'username': username,
        'no_name': no_name,
    }
    return render(request, 'onitama_game/index.html', context)

def game(request, game_id):
    game = get_object_or_404(Game, pk=game_id)
    socket_path = '/ws/onitama/game/{}/'.format(game_id)
    player = game.add_player(get_session(request))
    if player is None:
        user_player = 'observer'
    else:
        user_player = 'red' if player.color == 'R' else 'blue'
    game_data = game.client_encode()
    return render(
        request,
        'onitama_game/game.html',
        {
            'socket_path': socket_path,
            'user_player': user_player,
            'game_data': game_data,
        }
    )

@require_POST
def new(request):
    game = Game.create()
    game.add_player(get_session(request))
    return redirect('game', game_id=game.id)

@require_POST
def choose_guest_name(request):
    session = get_session(request)
    if not GuestUser.objects.filter(session__pk=request.session.session_key):
        GuestUser.objects.create(
            session=session,
            username=request.POST['username']
        )
    return redirect('index')

def get_session(request):
    try:
        # Need to manually save to ensure Session is stored (will be needed later)
        request.session.save()
    except UpdateError:
        # If Session was deleted from database must issue a new one
        request.session.flush()
        request.session.save()
    return Session.objects.get(pk=request.session.session_key)
