from django.db import models


class Game(models.Model):
    start_date = models.DateTimeField()
    cards = models.ManyToManyField("Card", through="GameCard")


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


class Card(models.Model):
    name = models.CharField(max_length=10)


class GameCard(models.Model):
    CARDHOLDER_CHOICES = (
        ('R', 'Red'),
        ('B', 'Blue'),
        ('N', 'Neutral'),
    )
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    card = models.ForeignKey(Card, on_delete=models.CASCADE)
    cardholder = models.CharField(max_length=1, choices=CARDHOLDER_CHOICES)
