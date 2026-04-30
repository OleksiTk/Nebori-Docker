from .base_settings import *

INSTALLED_APPS = COMMON_INSTALLED_APPS + [
    'auth.apps.RegistrationConfig',
    'user.apps.UserProfileConfig',
]

ROOT_URLCONF = 'core.urls'
