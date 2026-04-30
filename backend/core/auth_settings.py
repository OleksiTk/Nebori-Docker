from .base_settings import *

INSTALLED_APPS = COMMON_INSTALLED_APPS + [
    'auth.apps.RegistrationConfig',
]

ROOT_URLCONF = 'core.urls'