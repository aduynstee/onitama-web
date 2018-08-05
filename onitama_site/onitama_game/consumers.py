from channels.generic.websocket import WebsocketConsumer
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.sessions.models import Session
from asgiref.sync import async_to_sync
from .models import Game, Player, Move
from .modules import onitama as oni
import json

class GameConsumer(WebsocketConsumer):
    def connect(self):
        game_id = self.scope['url_route']['kwargs']['game_id']
        if (Game.objects.filter(id=game_id).exists()):
            self.game_id = game_id
            self.game_group = 'game_'+str(game_id)
            async_to_sync(self.channel_layer.group_add)(
                self.game_group,
                self.channel_name
            )
            self.accept()
            self.update_all()
        else:
            self.close()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        json_data = json.loads(text_data)
        try:
            request = json_data['request']
            game = Game.objects.get(pk=self.game_id)
            session = Session.objects.get(pk=self.scope['session'].session_key)
            if request == 'update':
                game_data = json.loads(game.client_encode())
                self.send(text_data=json.dumps({
                    'gameData': game_data,
                    'type': 'update',
                }))
            elif request == 'move':
                player = Player.objects.get(game=game, session=session)
                # Translate move data into proper format
                start = (
                    json_data['start'] % 5,
                    json_data['start'] // 5,
                )
                end = (
                    json_data['end'] % 5,
                    json_data['end'] // 5,
                )
                card = oni.NAME_TO_CARD[json_data['card']]
                if player.color == 'R':
                    oniplayer = oni.Player.RED
                else:
                    oniplayer = oni.Player.BLUE
                onimove = oni.Move(
                    player=oniplayer,
                    start=start,
                    end=end,
                    card=card
                )
                live_game = game.as_live_game()
                try:
                    live_game.do_move(onimove)
                    turn = len(live_game.moves)
                    x = ['A', 'B', 'C', 'D', 'E']
                    y = ['1', '2', '3', '4', '5']
                    card = game.cards.get(name__iexact=json_data['card'])
                    Move.objects.create(
                        game=game,
                        color=player.color,
                        start=x[start[0]]+y[start[1]],
                        end=x[end[0]]+y[end[1]],
                        turn=turn,
                        card=card,
                    )
                    self.update_all()
                except oni.IllegalMoveError:
                    self.send(text_data=json.dumps({
                        'type': 'error',
                        'message': 'You attempted an illegal move'
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

    # Send game update to all users
    def update_all(self):
        game_data = json.loads(
            Game.objects.get(pk=self.game_id).client_encode()
        )
        data = {
            'type': 'update',
            'gameData': game_data,
        }
        text_data = json.dumps(data)
        async_to_sync(self.channel_layer.group_send)(
            self.game_group,
            {
                'type': 'broadcast',
                'text_data': text_data,
            },
        )

    # Receive broadcasted data from game group
    def broadcast(self, event):
        self.send(text_data=event['text_data'])


class LobbyConsumer(WebsocketConsumer):
    def connect(self):
        async_to_sync(self.channel_layer.group_add)(
            'lobby',
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        data = json.loads(text_data)
        if data['request'] == 'load':
            self.load()

    def load(self):
        game_data = [
            {
                'name': 'Game '+str(game.id),
                'path': '/onitama/game/{}/'.format(str(game.id))
            } for game in Game.objects.all()[:5]
        ]
        self.send(json.dumps({
            'type': 'load',
            'data': game_data,
        }))
