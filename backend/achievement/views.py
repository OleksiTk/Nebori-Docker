from django.http import JsonResponse
from .models import Achievement, UserAchievement

def achievement_list(request):
    achievements = list(Achievement.objects.values())
    return JsonResponse(achievements, safe=False)

def user_achievements(request, user_id):
    user_achs = UserAchievement.objects.filter(user_id=user_id).select_related('achievement')
    data = [
        {
            'name': ua.achievement.name,
            'description': ua.achievement.description,
            'awarded_at': ua.awarded_at
        }
        for ua in user_achs
    ]
    return JsonResponse(data, safe=False)
