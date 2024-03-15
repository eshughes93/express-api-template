FROM node:18-slim

WORKDIR /app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install

COPY . .

RUN npm run build

# Copy only transplied production files and assets into image
COPY --from=build /app/dist ./dist
ENV HOME=/app
EXPOSE 3000
USER app
CMD [  "node", "./dist/index.js" ]

