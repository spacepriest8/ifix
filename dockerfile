# Use a Node.js base image
FROM node:23.1-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm install --only=production  # This will install only production dependencies

# Copy the rest of the application code into the container
COPY . .

# Expose the application's port
EXPOSE 5000

# Run the application
CMD ["npm", "start"]
