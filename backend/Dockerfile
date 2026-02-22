FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache postgresql-client
COPY . .
EXPOSE 3000
CMD ["node", "--watch", "src/server.js"]
