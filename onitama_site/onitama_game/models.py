from django.db import models


class Game(models.Model):
    start_date = models.DateTimeField()
    cards = models.CharField(max_length=200)


class Move(models.Model):
    PLAYER_CHOICES = (
        ('R', 'Red'),
        ('B', 'Blue'),
    )
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    player = models.CharField(max_length=1, choices=PLAYER_CHOICES)
    turn = models.PositiveSmallIntegerField()
    start = models.CharField(max_length=2)
    end = models.CharField(max_length=2)
    card = models.CharField(max_length=10)
