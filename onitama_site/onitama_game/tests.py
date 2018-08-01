import json
from .exceptions import GameIntegrityError
from .modules import onitama as oni
from django.test import TestCase
from .models import Game, Card, GameCard, Move, Player, GuestUser
from django.contrib.sessions.backends.db import SessionStore
from django.contrib.sessions.models import Session
from django.db import IntegrityError, transaction


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
            color='R',
            turn=1,
            start='C1',
            end='C2',
            card=Card.objects.get(name='OX')
        )
        Move.objects.create(
            game=cls.game,
            color='B',
            turn=2,
            start='C5',
            end='C4',
            card=Card.objects.get(name='CRANE')
        )
        Move.objects.create(
            game=cls.game,
            color='R',
            turn=3,
            start='C2',
            end='C3',
            card=Card.objects.get(name='BOAR')
        )
        Move.objects.create(
            game=cls.game,
            color='B',
            turn=4,
            start='C4',
            end='C2',
            card=Card.objects.get(name='TIGER')
        )
        Move.objects.create(
            game=cls.game,
            color='R',
            turn=5,
            start='C3',
            end='C4',
            card=Card.objects.get(name='HORSE')
        )

    def test_live_game_creation(self):
        live_game = self.game.as_live_game()
        self.assertEqual(live_game.pawns[oni.Player.RED], {(x, 0) for x in [0, 1, 3, 4]})
        self.assertEqual(live_game.pawns[oni.Player.BLUE], {(x, 4) for x in [0, 1, 3, 4]})
        self.assertEqual(live_game.kings[oni.Player.RED], {(2, 3)})
        self.assertEqual(live_game.kings[oni.Player.BLUE], {(2, 1)})
        locs = {(x, y) for x in range(5) for y in range(5)}
        locs.difference_update({(x, 0) for x in [0, 1, 3, 4]}.union({(x, 4) for x in [0, 1, 3, 4]}))
        locs.difference_update({(2, 3), (2, 1)})
        for loc in locs:
            self.assertEqual(live_game.board.get(loc), oni.Piece.EMPTY)

    def test_bad_move(self):
        Move.objects.create(
            game=self.game,
            color='R',
            turn=6,
            start='C1',
            end='C2',
            card=Card.objects.get(name='HORSE')
        )
        with self.assertRaises(GameIntegrityError):
            self.game.as_live_game()

    def test_client_encode(self):
        obj = json.loads(self.game.client_encode())
        self.assertTrue(obj['lastTurn'] == 5)
        self.assertTrue(len(obj['turns']) == 6)
        self.assertEqual(obj['turns'][0]['board'][0:5], ['redpawn', 'redpawn', 'redking', 'redpawn', 'redpawn'])
        self.assertEqual(obj['turns'][0]['board'][5:20], ['empty' for _ in range(15)])
        self.assertEqual(obj['turns'][0]['board'][20:25], ['bluepawn', 'bluepawn', 'blueking', 'bluepawn', 'bluepawn'])
        for key, value in obj['legalMoves'].items():
            self.assertTrue(key in {'ox', 'boar'})
        ox_moves = obj['legalMoves']['ox']
        # Using Ox card c2 can go to c1 c3 b2
        self.assertEqual(set(ox_moves[7]), {2, 12, 6})
        blue_pieces = {20, 21, 23, 24, 7}
        for i, moves in enumerate(ox_moves):
            if i in blue_pieces:
                self.assertFalse(moves is None)
            else:
                self.assertTrue(moves is None)
        self.assertEqual(set(ox_moves[20]), {15})
        self.assertEqual(obj['users']['red'], None)
        self.assertEqual(obj['users']['blue'], None)

    def test_player(self):
        s = SessionStore()
        s.create()
        session = Session.objects.get(pk=s.session_key)
        Player.objects.create(game=self.game, color='B', session=session)
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                Player.objects.create(game=self.game, color='B', session=session)
        s2 = SessionStore()
        s2.create()
        self.game.add_player(Session.objects.get(pk=s2.session_key))
        self.assertTrue(Player.objects.get(game=self.game, color='R'))

    def test_game_create(self):
        game = Game.create()
        for card in game.cards.all():
            self.assertTrue(card in self.cards)

    def test_usernames(self):
        s = SessionStore()
        s.create()
        session = Session.objects.get(pk=s.session_key)
        Player.objects.create(game=self.game, color='R', session=session)
        GuestUser.objects.create(session=session, username='testname')
        client_game = json.loads(self.game.client_encode())
        self.assertEqual(client_game['users']['red'], 'testname')
        self.assertEqual(client_game['users']['blue'], None)
        s2 = SessionStore()
        s2.create()
        self.game.add_player(Session.objects.get(pk=s2.session_key))
        client_game = json.loads(self.game.client_encode())
        self.assertEqual(client_game['users']['red'], 'testname')
        self.assertEqual(client_game['users']['blue'], 'Guest')
