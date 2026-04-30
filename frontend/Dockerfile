# Використовуємо легкий образ Node.js
FROM node:18-alpine

# Встановлюємо робочу директорію
WORKDIR /app

ARG NEXT_PUBLIC_AUTH_API_URL=http://localhost:8001
ARG NEXT_PUBLIC_USER_API_URL=http://localhost:8002
ARG NEXT_PUBLIC_ACHIEVEMENT_API_URL=http://localhost:8003
ARG NEXT_PUBLIC_NOTIFICATIONS_API_URL=http://localhost:8004

ENV NEXT_PUBLIC_AUTH_API_URL=${NEXT_PUBLIC_AUTH_API_URL}
ENV NEXT_PUBLIC_USER_API_URL=${NEXT_PUBLIC_USER_API_URL}
ENV NEXT_PUBLIC_ACHIEVEMENT_API_URL=${NEXT_PUBLIC_ACHIEVEMENT_API_URL}
ENV NEXT_PUBLIC_NOTIFICATIONS_API_URL=${NEXT_PUBLIC_NOTIFICATIONS_API_URL}

# Копіюємо файли залежностей
COPY package.json package-lock.json* ./

# Встановлюємо залежності
RUN npm install

# Копіюємо весь інший код
COPY . .

# Білдимо проект
RUN npm run build

# Відкриваємо порт 3000
EXPOSE 3000

# Запускаємо Next.js
CMD ["npm", "run", "start"]