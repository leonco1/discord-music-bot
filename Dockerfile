FROM node:alpine

# Install ffmpeg and system dependencies for node-gyp
RUN apk add --no-cache ffmpeg bash python3 make g++

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

# Expose a port (optional, if a web dashboard is included)
EXPOSE 3000

# Set environment variables (optional)
ENV NAME discord-music-bot

# Command to start the bot
CMD ["node", "index.js"]
