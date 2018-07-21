from channels.generic.websocket import WebsocketConsumer
from django.core.exceptions import ObjectDoesNotExist
from .models import Game
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
