FROM node:20-alpine

WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of your code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]