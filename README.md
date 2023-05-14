

## Description

My solution for the BrioHR challenge - The notification microservice

## Installation

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

- Build the mongoDB docker image 
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

## Test

```bash
npm run test
```


