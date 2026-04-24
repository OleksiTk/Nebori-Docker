# Використовуємо офіційний образ Python
FROM python:3.11-slim

# Забороняємо Python писати файли .pyc та буферизувати вивід (корисно для логів у Docker)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Встановлюємо залежності
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копіюємо код
COPY . .

# Відкриваємо порт 8000
EXPOSE 8000

# Застосовуємо міграції та запускаємо сервер розробки
CMD ["sh", "-c", "python manage.py migrate --noinput && python manage.py runserver 0.0.0.0:8000"]