import json
import pika
import os
import time
from django.core.management.base import BaseCommand
from notifications.models import Notification

class Command(BaseCommand):
    help = 'Consume notification events and save them'

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

        channel.queue_declare(queue='send_notification', durable=True)
        channel.queue_declare(queue='user_registered', durable=True)

        def callback(ch, method, properties, body):
            data = json.loads(body)
            user_id = data.get('user_id')
            message = data.get('message')
            
            # If it's a registration event, we also send a notification
            if method.routing_key == 'user_registered':
                username = data.get('username')
                message = f"Welcome to Nebori, {username}! Your account has been successfully registered."

            if user_id and message:
                Notification.objects.create(
                    user_id=user_id,
                    message=message
                )
                print(f" [x] Saved notification for user {user_id}: {message}")

            ch.basic_ack(delivery_tag=method.delivery_tag)

        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue='send_notification', on_message_callback=callback)
        channel.basic_consume(queue='user_registered', on_message_callback=callback)

        print(' [*] Waiting for notification messages. To exit press CTRL+C')
        channel.start_consuming()
