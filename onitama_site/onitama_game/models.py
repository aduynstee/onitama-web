from .modules import onitama as oni
from .exceptions import GameIntegrityError
from django.db import models


class Game(models.Model):
    start_date = models.DateTimeField(auto_now_add=True)
    cards = models.ManyToManyField("Card", through="GameCard")

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


class Move(models.Model):
    PLAYER_CHOICES = (
        ('R', 'Red'),
        ('B', 'Blue'),
    )
    LOCATION_CHOICES = tuple(
        (x+y, x+y) for x in ['A', 'B', 'C', 'D', 'E'] for y in ['1', '2', '3', '4', '5']
    )
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player = models.CharField(max_length=1, choices=PLAYER_CHOICES)
    turn = models.PositiveSmallIntegerField()
    start = models.CharField(max_length=2, choices=LOCATION_CHOICES)
    end = models.CharField(max_length=2, choices=LOCATION_CHOICES)
    card = models.ForeignKey("Card", on_delete=models.CASCADE)

    class Meta:
        ordering = ["turn"]
        unique_together = ("game", "turn")

    def as_live_move(self):
        player = oni.Player.RED if self.player == 'R' else oni.Player.BLUE
        x = ['A', 'B', 'C', 'D', 'E']
        y = ['1', '2', '3', '4', '5']
        start = (x.index(self.start[0]), y.index(self.start[1]))
        end = (x.index(self.end[0]), y.index(self.end[1]))
        card = self.card.as_live_card()
        return oni.Move(player, start, end, card)


class Card(models.Model):
    name = models.CharField(max_length=10)

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
