from .base_settings import *

INSTALLED_APPS = COMMON_INSTALLED_APPS + [
    'user.apps.UserProfileConfig',
]

ROOT_URLCONF = 'user.urls'