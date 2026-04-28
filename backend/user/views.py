from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from auth.services import decode_jwt_token


def _extract_bearer_token(request):
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None
    return auth_header.split(' ', 1)[1].strip()


@csrf_exempt
def profile_placeholder(request):
    if request.method != 'GET':
        return JsonResponse({'detail': 'Method not allowed.'}, status=405)

    token = _extract_bearer_token(request)
    if not token:
        return JsonResponse({'detail': 'Authorization token is required.'}, status=401)

    try:
        payload = decode_jwt_token(token)
    except Exception:
        return JsonResponse({'detail': 'Invalid or expired token.'}, status=401)

    user_id = payload.get('sub')
    if not user_id:
        return JsonResponse({'detail': 'Invalid token payload.'}, status=401)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({'detail': 'User not found.'}, status=404)

    return JsonResponse(
        {
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            },
        }
    )
