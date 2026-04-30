from django.urls import path
from . import views

urlpatterns = [
    path('achievements/', views.achievement_list, name='achievement-list'),
    path('user-achievements/<int:user_id>/', views.user_achievements, name='user-achievements'),
]
