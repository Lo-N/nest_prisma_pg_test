# NestJS test task

Scope:
1) Basic API development
2) Middleware implementation
3) Error handling
4) Database integration
5) Unit testing
6) JWT authentication

How to run project
-
Long story short - list of commands:  
1-`npm install --frozen-lockfile`  
2-`npm run start:dev`  
3-`docker compose up`  
4-`npx prisma db seed`  
5-`npx prisma studio`  

Step-by-step

1. Clone project `git clone https://github.com/Lo-N/test_task.git`

2. Install dependencies `npm install --frozen-lockfile`  
JFY: The version of node.js used is specified in the `.node-version` file

3. Run NestJS app `npm run start:dev`

4. Run Prisma `docker compose up`

5. Fill database with predefined records(seeds) `npx prisma db seed`

5. (optional) Run Prisma studio `npx prisma studio` for db visualization


> [!TIP]
> Please take a look at folder `./postman`. There you can find postman collection and postman env.  

> [!WARNING]
> I can't leave variables in the code, so let them be here 😅
> ```
> DATABASE_URL="postgresql://postgres:postgres@localhost:5432/test"
> JWT_SECRET="edb71ec00672f72f2f4e8aaa8342aa271b369535a6e78ad7a4e1b9573051ab2f"
>```
