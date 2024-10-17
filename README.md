# NestJS test task

> [!NOTE]
> This project will be gradually supplemented.
> - Unit test coverage will be increased.
> - E2E test coverage will be increased.
> - Deploy to AWS will be implemented.
> - ...

Scope:
1) Basic API development
2) Middleware implementation
3) Error handling
4) Database integration
5) Unit testing
6) JWT authentication
7) Pre-commits
8) Swagger
9) Github actions checks

> [!TIP]
> Please take a look at folder `./postman`. There you can find postman collection and postman env.
> Also there is four public endpoints  
> 1 - GET `http://localhost:3000/health_check` - health check  
> 2 - GET `http://localhost:3000/users` - getting list of all users
> 3 - POST `http://localhost:3000/auth/signIn` - authorization, getting auth token
> 4 - POST `http://localhost:3000/auth/signUp` - creating new user, getting auth token
> 
> Before sending requests to other endpoint you need to obtain jwt token.
> Send POST request to `http://localhost:3000/auth/signIn` with "login" and "password" in the body.
> You can get login and password using the following request - GET `http://localhost:3000/users`.

How to run project
-
Long story short - `docker compose up`  

Step-by-step

1. Clone project  
   `git clone https://github.com/Lo-N/test_task.git`  
2. Create a `.env` file in the root of the project and paste the values ​​below  
3. Run project  
   `docker compose up`.  
4. (optional) Run Prisma studio for db visualization  
    `npm run prisma_studio`  

> [!WARNING]
> I can't leave variables in the code, so let them be here 😅
> ```
> POSTGRES_DB="postgres"
> POSTGRES_USER="postgres"
> POSTGRES_PASSWORD="postgres"
> DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
> JWT_SECRET="edb71ec00672f72f2f4e8aaa8342aa271b369535a6e78ad7a4e1b9573051ab2f"
> JWT_TTL="10min"
> NODE_ENV="development"
> APP_PORT="3000"
> DB_PORT="5432"
> DB_PRISMA_STUDIO_PORT="5454"
>```
