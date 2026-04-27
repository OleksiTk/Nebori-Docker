from django.urls import path

from .views import profile_placeholder

urlpatterns = [
    path('profile/', profile_placeholder),
]
