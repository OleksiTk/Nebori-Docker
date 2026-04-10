# Використовуємо легкий образ Node.js
FROM node:18-alpine

# Встановлюємо робочу директорію
WORKDIR /app

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