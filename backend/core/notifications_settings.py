from .base_settings import *

INSTALLED_APPS = COMMON_INSTALLED_APPS + [
    'notifications.apps.NotificationsConfig',
]

ROOT_URLCONF = 'core.urls'
