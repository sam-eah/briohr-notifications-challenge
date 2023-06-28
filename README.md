

## Description

A nestjs notification microservice

## Installation

- Build and run the mongoDB docker image 
(For an easier installation - and given there are no sensitive data - I have versioned the .env file)
```bash
docker compose build
docker compose up
```
Make sure the container is correctly running, logs should show `REPLICA SET ONLINE`, you can also run 
```bash
 docker compose exec mongodb mongo -u mongo -p example 
 ```
 And then `show dbs`

- Install the required node modules
```bash
npm install
```

to make sure nestjs was correctly installed, you can run 
```bash
npm run start
```
Then go to http://localhost:3000/notifications/646118e0f1d213e188c10989 on your brower and you should see this message:
`{"statusCode":400,"message":"user not found"}`

## Initialize the Database

Generate Typescript types
```bash
npx prisma generate
``` 

Synchronize the DB
```bash
npx prisma db push
``` 

Launch prisma studio
```bash
npx prisma studio
``` 

## Seed the Database 

Make sure the mongoDB container is running, then run 
```bash
npx prisma db seed
``` 


## Running the app


```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

Endpoints:
- GET /notifications/:userId
- POST /notifications/

using the following body:
```
{
  companyId: "{{companyId}}",
  userId: "{{userId}}",
  notificationType: "{{notificationType}}",
}
```
The easiest is to get the companyId, userId and notificationType from the database (after seeding), with prisma studio for example.

There is also a Postman Collection that you can import and set the variables in there.

## Test

```bash
# run unit tests once
npm run test

# watch mode
npm run test:watch

# run end to end tests
npm run test:e2e
```
Important note: some tests will need the seeds from the database (even if the data is mocked) to pass.

