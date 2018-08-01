from django.urls import path
from django.views.generic.base import TemplateView
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('game/<int:game_id>/', views.game, name='game'),
    path('new/', views.new, name='new'),
    path('guestname/', views.choose_guest_name, name='choose_guest_name')
]
