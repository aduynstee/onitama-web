from channels.generic.websocket import WebsocketConsumer
from django.core.exceptions import ObjectDoesNotExist
from .models import Game
import json

class GameConsumer(WebsocketConsumer):
    def connect(self):
        game_id = self.scope['url_route']['kwargs']['game_id']
        if (Game.objects.filter(id=game_id).exists()):
            self.scope['game_id'] = game_id
            self.accept()
        else:
            self.close()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        json_data = json.loads(text_data)
        try:
            request = json_data['request']
            # Just decline for now
            if request == 'player':
                self.send(text_data=json.dumps({
                    'type': 'player',
                    'player': 'denied',
                }))
        except KeyError:
            self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Unrecognized request type'
            }))
