# Використовуємо легкий образ Node.js
FROM node:18-alpine

# Встановлюємо робочу директорію
WORKDIR /app

ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

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