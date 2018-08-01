import json
import random
from .modules import onitama as oni
from .exceptions import GameIntegrityError
from django.db import models
from django.contrib.sessions.models import Session


class Game(models.Model):
    start_date = models.DateTimeField(auto_now_add=True)
    cards = models.ManyToManyField("Card", through="GameCard")

    @classmethod
    def create(cls):
        cards = random.sample(list(Card.objects.all()), 5)
        game = Game.objects.create()
        holders = ['R', 'R', 'B', 'B', 'N']
        for i in range(5):
            GameCard.objects.create(
                game=game,
                card=cards[i],
                cardholder=holders[i]
            )
        return game

    # Add Player to game given a user Session
    # Returns None if game is full
    # If Player successfully added or already existed, return the Player
    def add_player(self, session):
        players = Player.objects.filter(game=self)
        if players.filter(session=session).exists():
            return players.get(session=session)
        if players.count() == 0:
            return Player.objects.create(
                game=self,
                color=random.choice(['R','B']),
                session=session,
            )
        elif players.count() == 1:
            color = 'R' if players.first().color == 'B' else 'B'
            return Player.objects.create(
                game=self,
                color=color,
                session=session,
            )
        else:
            return None

    def as_live_game(self):
        gc = GameCard.objects.filter(game=self)
        red = [x.card.as_live_card() for x in gc.filter(cardholder='R')]
        blue = [x.card.as_live_card() for x in gc.filter(cardholder='B')]
        neutral = [gc.filter(cardholder='N').first().card.as_live_card()]
        live_game = oni.Game(red+blue+neutral)
        for move in self.move_set.all():
            try:
                live_game.do_move(move.as_live_move())
            except oni.IllegalMoveError:
                raise GameIntegrityError(self, move)
        return live_game

    # Return a customized encoding of the game that will be used on the client side
    def client_encode(self):
        gc = GameCard.objects.filter(game=self)
        red = [x.card.as_live_card() for x in gc.filter(cardholder='R')]
        blue = [x.card.as_live_card() for x in gc.filter(cardholder='B')]
        neutral = [gc.filter(cardholder='N').first().card.as_live_card()]
        live_game = oni.Game(red + blue + neutral)
        card_mapping = {card.as_live_card(): card.name.lower() for card in self.cards.all()}
        piece_mapping = {
            oni.Piece.EMPTY: 'empty',
            oni.Piece.R_PAWN: 'redpawn',
            oni.Piece.R_KING: 'redking',
            oni.Piece.B_PAWN: 'bluepawn',
            oni.Piece.B_KING: 'blueking'
        }
        start_player = live_game.active_player

        def board_func(game):
            return list(map(lambda x: piece_mapping[x], game.board.array))

        def card_func(game):
            cardlist = game.cards[oni.Player.RED] + game.cards[oni.Player.BLUE] + [game.neutral_card]
            return [card_mapping[card] for card in cardlist]

        turns = [{
            'number': 0,
            'cards': card_func(live_game),
            'board': board_func(live_game),
            'lastMove': None,
        }]
        for move in self.move_set.all():
            try:
                live_game.do_move(move.as_live_move())
                turns.append({
                    'number': move.turn,
                    'cards': card_func(live_game),
                    'board': board_func(live_game),
                    'lastMove': '{}-{} [{}]'.format(move.start.lower(), move.end.lower(), move.card.name.lower())
                })
            except oni.IllegalMoveError:
                raise GameIntegrityError(self, move)
        lm = dict()
        for card, move_dict in live_game.legal_moves().items():
            movelist = [None for _ in range(25)]
            for start, end_set in move_dict.items():
                index = start[0] + 5*start[1]
                endlist = [coord[0] + 5*coord[1] for coord in end_set]
                movelist[index] = endlist
            card_name = card_mapping[card]
            lm[card_name] = movelist
        users = {
            'red': None,
            'blue': None,
        }
        for player in self.player_set.all():
            color = 'red' if player.color == 'R' else 'blue'
            try:
                # Check if Player chose a username
                users[color] = GuestUser.objects.get(session=player.session).username
            except GuestUser.DoesNotExist:
                # Otherwise give name as 'Guest'
                users[color] = 'Guest'
        result = {
            'turns': turns,
            'activePlayer': 'red' if live_game.active_player == oni.Player.RED else 'blue',
            'lastTurn': 0 if not self.move_set.exists() else self.move_set.last().turn,
            'legalMoves': lm,
            'startPlayer': 'red' if start_player == oni.Player.RED else 'blue',
            'users': users,
        }
        return json.dumps(result)


class Move(models.Model):
    PLAYER_CHOICES = (
        ('R', 'Red'),
        ('B', 'Blue'),
    )
    LOCATION_CHOICES = tuple(
        (x+y, x+y) for x in ['A', 'B', 'C', 'D', 'E'] for y in ['1', '2', '3', '4', '5']
    )
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    color = models.CharField(max_length=1, choices=PLAYER_CHOICES)
    turn = models.PositiveSmallIntegerField()
    start = models.CharField(max_length=2, choices=LOCATION_CHOICES)
    end = models.CharField(max_length=2, choices=LOCATION_CHOICES)
    card = models.ForeignKey("Card", on_delete=models.CASCADE)

    class Meta:
        ordering = ["turn"]
        unique_together = ("game", "turn")

    def as_live_move(self):
        player = oni.Player.RED if self.color == 'R' else oni.Player.BLUE
        x = ['A', 'B', 'C', 'D', 'E']
        y = ['1', '2', '3', '4', '5']
        start = (x.index(self.start[0]), y.index(self.start[1]))
        end = (x.index(self.end[0]), y.index(self.end[1]))
        card = self.card.as_live_card()
        return oni.Move(player, start, end, card)


class Card(models.Model):
    name = models.CharField(max_length=10, unique=True)

    def as_live_card(self):
        return oni.NAME_TO_CARD[self.name.lower()]


class GameCard(models.Model):
    CARDHOLDER_CHOICES = (
        ('R', 'Red'),
        ('B', 'Blue'),
        ('N', 'Neutral'),
    )
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    card = models.ForeignKey(Card, on_delete=models.CASCADE)
    cardholder = models.CharField(max_length=1, choices=CARDHOLDER_CHOICES)

class Player(models.Model):
    COLOR_CHOICES = (
        ('R', 'Red'),
        ('B', 'Blue'),
    )
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    color = models.CharField(max_length=1, choices=COLOR_CHOICES)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)

    class Meta:
        unique_together = (
            ('game', 'color'),
            ('game', 'session'),
        )

# For allowing an unregistered user to select a username, which is tied to Session
class GuestUser(models.Model):
    session = models.OneToOneField(Session, on_delete=models.CASCADE)
    username = models.CharField(max_length=20)
