from channels.generic.websocket import WebsocketConsumer
from django.contrib.sessions.models import Session
from django.core.exceptions import ObjectDoesNotExist
from .models import Game, TestSessionUser
import json

class GameConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        game_id = self.scope['url_route']['kwargs']['game_id']
        try:
            game = Game.objects.get(id=game_id)
            game_data = json.loads(game.client_encode())
            self.send(text_data=json.dumps({
                'gameData': game_data,
                'type': 'update',
            }))
        except ObjectDoesNotExist:
            pass

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        pass

class TestSessionConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        username = self.scope['url_route']['kwargs']['username']
        print(self.scope['session'].session_key)
        self.scope['session']['connected'] = True
        self.scope['session'].save()
        query = TestSessionUser.objects.filter(username=username)
        session = Session.objects.get(pk=self.scope['session'].session_key)
        if query.exists():
            user = query.first()
            if user.has_connected_session():
                if user.session.session_key == session.session_key:
                    print('Welcome '+username)
                else:
                    print('reject attempt to use username '+username)
            else:
                user.session = session
                user.save()
        else:
            TestSessionUser.objects.create(username=username, session=session)



    def disconnect(self, close_code):
        self.scope['session']['connected'] = False
        self.scope['session'].save()

    def receive(self, text_data):
        pass
