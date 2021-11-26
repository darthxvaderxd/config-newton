Config Newton (build on NestJS)

## Description

This is a node JS project to allow for housing of an easy to use, secure, and cheap config service

## Installation

```bash
yarn install
```

## Running the app

```bash
# development
yarn start

# watch mode
yarn start:dev

# production mode
yarn start:prod

# using docker
docker-compose up
```

## API

| path                      | method | description                                                           | headers                     | body                                                                           |
|---------------------------|--------|-----------------------------------------------------------------------|-----------------------------|--------------------------------------------------------------------------------|
| /configs/:deployment      | get    | get all of the configuration settings for a deployment / environment  | x-api-key (may be required) | no                                                                             |
| /configs/:deployment/:key | get    | get a specific configuration setting for a deployment / environment   | x-api-key (may be required) | no                                                                             |
| /configs/:deployment      | post   | update / create configuration settings for a deployment / environment | x-api-key (may be required) | yes post key pair values as object ie : `{ "message": "hello", "foo": "bar" }` |
| /configs/:deployment/:key | post   | update / create configuration setting for a deployment / environment  | x-api-key (may be required) | yes post object with value ie : `{ "value": "updated config" }`                |

## Command line arguments

For security purposes the api will not create new deployments or deployment keys.
You will need to run the following commands to do so.

Create new deployment: 
```bash
yarn create-deployment {deployment name} {y/n}
```

Create new deployment key: 
```bash
yarn create-deployment-key {deployment name}
```

Invalidate deployment keys:
```bash
yarn invalidate-deployment-key {deployment name}
```

## A bit about NestJS

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)
