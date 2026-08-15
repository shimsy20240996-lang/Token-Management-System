# Use Node.js 20 slim (Debian based, much better Prisma compatibility)
FROM node:20-slim

# Install OpenSSL which is required by Prisma
RUN apt-get update -y && apt-get install -y openssl

# Create app directory
WORKDIR /usr/src/app

# We need to set the Database URL since .env is not in git
ENV DATABASE_URL="file:./dev.db"
ENV JWT_SECRET="supersecretkey123"
ENV PORT=3000

# Setup Backend
WORKDIR /usr/src/app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npx prisma generate

# Create the SQLite database and seed it during the build!
RUN npx prisma db push
RUN npm run seed

RUN npm run build

# Setup Frontend
WORKDIR /usr/src/app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Move back to backend to start the server
WORKDIR /usr/src/app/backend

EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
