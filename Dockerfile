# Use Node.js LTS version
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy root files
COPY package*.json ./

# Setup Backend
WORKDIR /usr/src/app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npx prisma generate
RUN npm run build

# Setup Frontend
WORKDIR /usr/src/app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Move back to backend to start the server
WORKDIR /usr/src/app/backend

# Expose port (Render sets PORT automatically, but default to 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
