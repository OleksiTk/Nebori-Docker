import json
import pika
import os
import time
from django.core.management.base import BaseCommand
from achievement.models import Achievement, UserAchievement

class Command(BaseCommand):
    help = 'Consume user_registered events and award achievements'

    def handle(self, *args, **options):
        rabbitmq_url = os.environ.get('RABBITMQ_URL', 'amqp://guest:guest@rabbitmq:5672/')
        params = pika.URLParameters(rabbitmq_url)
        
        connection = None
        while not connection:
            try:
                connection = pika.BlockingConnection(params)
            except pika.exceptions.AMQPConnectionError:
                print(" [*] RabbitMQ not ready, retrying in 5 seconds...")
                time.sleep(5)

        channel = connection.channel()

        channel.queue_declare(queue='user_registered', durable=True)

        def callback(ch, method, properties, body):
            data = json.loads(body)
            user_id = data.get('user_id')
            username = data.get('username')
            
            print(f" [x] Received registration for user {username} ({user_id})")

            # Award "Welcome" achievement
            achievement, created = Achievement.objects.get_or_create(
                name="Welcome Aboard!",
                defaults={'description': "Awarded for successful registration."}
            )

            UserAchievement.objects.get_or_create(
                user_id=user_id,
                achievement=achievement
            )
            
            print(f" [x] Awarded 'Welcome' achievement to user {user_id}")
            
            # Now notify the notification service about the achievement
            from core.rabbitmq import publish_message
            publish_message('send_notification', {
                'user_id': user_id,
                'message': f"Congratulations! You've received the '{achievement.name}' achievement!"
            })

            ch.basic_ack(delivery_tag=method.delivery_tag)

        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue='user_registered', on_message_callback=callback)

        print(' [*] Waiting for registration messages. To exit press CTRL+C')
        channel.start_consuming()
