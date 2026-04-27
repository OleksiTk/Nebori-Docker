import json

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .services import generate_jwt_token


def add_cors_headers(response):
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    return response


@csrf_exempt
def register_user(request):
    if request.method == 'OPTIONS':
        return add_cors_headers(HttpResponse(status=204))

    if request.method != 'POST':
        return add_cors_headers(JsonResponse({'detail': 'Method not allowed.'}, status=405))

    try:
        payload = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return add_cors_headers(JsonResponse({'detail': 'Invalid JSON payload.'}, status=400))

    username = str(payload.get('username', '')).strip()
    email = str(payload.get('email', '')).strip()
    password = str(payload.get('password', ''))
    confirm_password = str(payload.get('confirmPassword', ''))

    errors = {}

    if not username:
        errors['username'] = 'Username is required.'
    elif User.objects.filter(username__iexact=username).exists():
        errors['username'] = 'This username is already taken.'

    if not email:
        errors['email'] = 'Email is required.'
    elif User.objects.filter(email__iexact=email).exists():
        errors['email'] = 'This email is already registered.'

    if not password:
        errors['password'] = 'Password is required.'
    elif password != confirm_password:
        errors['confirmPassword'] = 'Passwords do not match.'
    else:
        try:
            validate_password(password, user=User(username=username, email=email))
        except ValidationError as error:
            errors['password'] = ' '.join(error.messages)

    if errors:
        return add_cors_headers(JsonResponse({'errors': errors}, status=400))

    try:
        user = User.objects.create_user(username=username, email=email, password=password)
    except IntegrityError:
        return add_cors_headers(JsonResponse({'detail': 'Unable to create user.'}, status=400))

    token = generate_jwt_token(user)

    return add_cors_headers(
        JsonResponse(
            {
                'message': 'User registered successfully.',
                'token': token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                },
            },
            status=201,
        )
    )


@csrf_exempt
def login_user(request):
    if request.method == 'OPTIONS':
        return add_cors_headers(HttpResponse(status=204))

    if request.method != 'POST':
        return add_cors_headers(JsonResponse({'detail': 'Method not allowed.'}, status=405))

    try:
        payload = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return add_cors_headers(JsonResponse({'detail': 'Invalid JSON payload.'}, status=400))

    username = str(payload.get('username', '')).strip()
    password = str(payload.get('password', ''))

    if not username or not password:
        return add_cors_headers(JsonResponse({'detail': 'Username and password are required.'}, status=400))

    user = authenticate(username=username, password=password)
    if user is None:
        return add_cors_headers(JsonResponse({'detail': 'Invalid credentials.'}, status=401))

    token = generate_jwt_token(user)

    return add_cors_headers(
        JsonResponse(
            {
                'message': 'Login successful.',
                'token': token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                },
            }
        )
    )
