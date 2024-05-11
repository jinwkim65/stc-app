# Use Node.js as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /frontend

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Install serve to serve the build folder
RUN npm install -g serve

# Expose port 5000
EXPOSE 5000

# Command to serve the app
CMD ["serve", "-s", "build", "-l", "5000"]
