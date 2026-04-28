from django.db import models

class Notification(models.Model):
    user_id = models.IntegerField()
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for User {self.user_id}: {self.message[:20]}"
