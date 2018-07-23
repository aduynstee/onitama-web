from channels.generic.websocket import WebsocketConsumer
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.sessions.models import Session
from .models import Game, Player
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
            game = Game.objects.get(pk=self.scope['game_id'])
            session = Session.objects.get(pk=self.scope['session'].session_key)
            # Find player according to session
            # If not found try to add new player to game for this session
            # If game is full respond with 'denied'
            if request == 'player':
                players = game.player_set
                if players.filter(session=session).exists():
                    color = players.filter(session=session).first().color
                    response = 'red' if color == 'R' else 'blue'
                elif players.count() == 0:
                    # Assign red to first player
                    Player.objects.create(game=game, session=session, color='R')
                    response = 'red'
                elif players.count() == 1:
                    # Assume red is always assigned first, so blue is chosen next
                    Player.objects.create(game=game, session=session, color='B')
                    response = 'blue'
                else:
                    response = 'denied'
                self.send(text_data=json.dumps({
                    'type': 'player',
                    'player': response,
                }))
            elif request == 'update':
                game_data = json.loads(game.client_encode())
                self.send(text_data=json.dumps({
                    'gameData': game_data,
                    'type': 'update',
                }))
        except KeyError:
            self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'A server error occurred'
            }))
            return
        except ObjectDoesNotExist:
            self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'A server error occurred'
            }))
            return
