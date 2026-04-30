from datetime import datetime, timedelta, timezone

import jwt
from django.conf import settings


def generate_jwt_token(user):
    now = datetime.now(timezone.utc)
    payload = {
        'sub': str(user.id),
        'username': user.username,
        'email': user.email,
        'iat': int(now.timestamp()),
        'exp': int((now + timedelta(days=1)).timestamp()),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')


def decode_jwt_token(token):
    return jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
