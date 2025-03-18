FROM node:22-alpine
WORKDIR /app

# Install packages
RUN apk add --no-cache git
COPY package*.json ./
RUN npm install -g expo-cli
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port Expo web uses
EXPOSE 19006

# Set environment variable to make sure we use web
ENV EXPO_PLATFORM=web

# Run expo on the web
CMD ["npx", "expo", "start", "--web", "--non-interactive", "--port", "19006", "--host", "localhost"]