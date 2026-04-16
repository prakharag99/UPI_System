# Using Lightweight Base Image (so no need to make linux from scratch):

FROM node:20-alpine

# set working dir inside that container where our app code will be there:

WORKDIR /app

# Dependencies Layer:

COPY package*.json ./

# Install Dependencies:

RUN npm install

# Copy rest of the code:

COPY . .

# Expose Port:

EXPOSE 3000

# Start the APP:

CMD ["node", "server.js"]