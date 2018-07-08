from django.test import TestCase
from .models import Game, Card, GameCard, Move


class MyTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.cards = [
            Card.objects.create(name="OX"),
            Card.objects.create(name="HORSE"),
            Card.objects.create(name="TIGER"),
            Card.objects.create(name="CRANE"),
            Card.objects.create(name="BOAR"),
        ]
        cls.game = Game.objects.create()
        holders = ['R', 'R', 'B', 'B', 'N']
        cls.gamecards = [
            GameCard.objects.create(
                game=cls.game,
                card=cls.cards[i],
                cardholder=holders[i]
            ) for i in range(5)
        ]
        Move.objects.create(
            game=cls.game,
            player='R',
            turn=1,
            start='C1',
            end='C2',
            card=Card.objects.get(name='OX')
        )
        Move.objects.create(
            game=cls.game,
            player='B',
            turn=2,
            start='C5',
            end='C4',
            card=Card.objects.get(name='CRANE')
        )
        Move.objects.create(
            game=cls.game,
            player='R',
            turn=3,
            start='C2',
            end='C3',
            card=Card.objects.get(name='BOAR')
        )
        Move.objects.create(
            game=cls.game,
            player='B',
            turn=4,
            start='C4',
            end='C2',
            card=Card.objects.get(name='TIGER')
        )
        Move.objects.create(
            game=cls.game,
            player='R',
            turn=5,
            start='C3',
            end='C4',
            card=Card.objects.get(name='HORSE')
        )

