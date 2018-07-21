from django.shortcuts import render
from django.contrib.sessions.models import Session
from .models import Game, TestSessionUser

def index(request):
    game_list = Game.objects.all()
    context = {
        'game_list': game_list,
    }
    return render(request, 'onitama_game/index.html', context)

def session(request, username):
    request.session['connected'] = True
    request.session.save()
    query = TestSessionUser.objects.filter(username=username)
    session = Session.objects.get(pk=request.session.session_key)
    if query.exists():
        user = query.first()
        if user.has_connected_session():
            if user.session.pk == session.pk:
                print('Welcome '+username)
            else:
                print('reject attempt to use username '+username)
        else:
            user.session = session
            user.save()
    else:
        TestSessionUser.objects.create(username=username, session=session)
    return render(request, 'onitama_game/sessiontest.html', {"username": username})
