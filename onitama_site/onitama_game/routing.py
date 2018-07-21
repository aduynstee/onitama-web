from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path('ws/onitama/game/<int:game_id>/', consumers.GameConsumer),
]
