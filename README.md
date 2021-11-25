Config Newton (build on NestJS)

## A bit about NestJS

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## Description

This is a node JS project to allow for housing of an easy to use, secure, and cheap config service

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# using docker
docker-compose up
```

| path                      | method | description                                                           | headers                     | body                                                                           |
|---------------------------|--------|-----------------------------------------------------------------------|-----------------------------|--------------------------------------------------------------------------------|
| /configs/:deployment      | get    | get all of the configuration settings for a deployment / environment  | x-api-key (may be required) | no                                                                             |
| /configs/:deployment/:key | get    | get a specific configuration setting for a deployment / environment   | x-api-key (may be required) | no                                                                             |
| /configs/:deployment      | post   | update / create configuration settings for a deployment / environment | x-api-key (may be required) | yes post key pair values as object ie : `{ "message": "hello", "foo": "bar" }` |
| /configs/:deployment/:key | post   | update / create configuration setting for a deployment / environment  | x-api-key (may be required) | yes post object with value ie : `{ "value": "updated config" }`                |
