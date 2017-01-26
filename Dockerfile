FROM node:latest
COPY . /usr/app
WORKDIR /usr/app
EXPOSE 3000
CMD ["node", "app.js"]
