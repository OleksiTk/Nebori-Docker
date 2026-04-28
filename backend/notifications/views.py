from django.http import JsonResponse
from .models import Notification

def notification_list(request):
    user_id = request.GET.get('user_id')
    if not user_id:
        return JsonResponse({'error': 'user_id is required'}, status=400)
    
    notifications = list(Notification.objects.filter(user_id=user_id).order_by('-created_at').values())
    return JsonResponse(notifications, safe=False)
