# NestJS test task

Scope:
1) Basic API development
2) Middleware implementation
3) Error handling
4) Database integration
5) Unit testing
6) JWT authentication

> [!TIP]
> Please take a look at folder `./postman`. There you can find postman collection and postman env.
> Also there is two public endpoints  
> 1 - GET `http://localhost:3000/health_check` - helth check  
> 2 - GET `http://localhost:3000/users` - geting list of all users
> 
> Before sending requests to other endpoint you need to obtain jwt token.
> Send POST request to `http://localhost:3000/auth/login` with "login" and "password" at the body.
> You can get login and password using the following request - GET `http://localhost:3000/users`.

How to run project
-
Long story short - list of commands:  
1-`npm install --frozen-lockfile`  
2-`npx prisma generate`  
3-`docker compose up`  
4-`npx prisma migrate deploy`  
5-`npx prisma db seed`  
6-`npx prisma studio`  
7-`npm run start`  

Step-by-step

0. Clone project  
   `git clone https://github.com/Lo-N/test_task.git`  
1. Install dependencies  
   `npm install --frozen-lockfile`  
JFYI: The version of node.js used is specified in the `.node-version` file  
2. Create a `.env` file in the root of the project and paste the values ​​below  
3. To re-establish the link between prisma and .env file run  
   `npx prisma generate`   
4. Run Prisma  
   `docker compose up`.  
5. Apply migrations  
   `npx prisma migrate deploy`  
6. Fill database with predefined records(seeds)  
    `npx prisma db seed`  
7. (optional) Run Prisma studio for db visualization  
    `npx prisma studio`  
8. Run NestJS app  
    `npm run start` 

> [!WARNING]
> I can't leave variables in the code, so let them be here 😅
> ```
> DATABASE_URL="postgresql://postgres:postgres@localhost:5432"
> JWT_SECRET="edb71ec00672f72f2f4e8aaa8342aa271b369535a6e78ad7a4e1b9573051ab2f"
>```
