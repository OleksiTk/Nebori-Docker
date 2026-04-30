from .base_settings import *

INSTALLED_APPS = COMMON_INSTALLED_APPS + [
    'achievement.apps.AchievementConfig',
]

ROOT_URLCONF = 'core.urls'
