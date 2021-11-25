FROM node:16
WORKDIR /app
COPY . .

RUN yarn install
RUN npm run build

#CMD [ "npm run start:prod" ]
CMD [ "npm run start:dev" ]
ENTRYPOINT [ "sh", "-c" ]
EXPOSE 3200
