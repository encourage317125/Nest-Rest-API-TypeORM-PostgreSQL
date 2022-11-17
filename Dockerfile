FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies

COPY package*.json ./

#RUN npm run build
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 9090
# CMD [ "node", "index.js" ]
CMD [ "npm", "start" ]