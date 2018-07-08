class GameIntegrityError(Exception):
    def __init__(self, game, move):
        """Raised when a Game is found to contain an illegal Move."""
        self.game = game
        self.move = move
