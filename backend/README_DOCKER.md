# Chaos Theory — Docker Setup

This project is containerized using Docker and Docker Compose.

The application consists of:

- **Frontend** — HTML, CSS and JavaScript served using Nginx
- **Backend** — Node.js + Express
- **Database** — PostgreSQL 18
- **Email submission** — Formspree
- **Database initialization** — `database/init.sql`
- **Persistent database storage** — Docker named volume

---

## 1. Project Architecture

The Dockerized application follows this structure:

```text
                    Docker Compose
                         |
        +----------------+----------------+
        |                |                |
        v                v                v
    Frontend          Backend         PostgreSQL
     Nginx            Node.js            DB
     :80              :5000            :5432
        |                |
        |                |
   Browser          API Requests
        |                |
        +-------> Backend
                       |
                       |
                  PostgreSQL
```

Inside Docker Compose, the backend communicates with PostgreSQL using the PostgreSQL service name:

```
postgres
```

Therefore, the backend database URL inside Docker should use:

```
postgres:5432
```

and **NOT**:

```
localhost:5432
```

---

## 2. Project Structure

The relevant Docker structure is:

```text
demo1/
│
├── docker-compose.yml
│
├── database/
│   └── init.sql
│
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env
│   ├── .docker.env
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── db.js
│   └── routes/
│       └── bookings.js
│
└── frontend/
    ├── Dockerfile
    ├── .dockerignore
    ├── home.html
    ├── css/
    ├── js/
    └── assets/
```

---

## 3. Dockerfiles

### Backend Dockerfile

The backend uses Node.js 22 Alpine.

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 5000

CMD ["npm","start"]
```

The backend is exposed on:

```
5000
```

### Frontend Dockerfile

The frontend is a static HTML/CSS/JavaScript application served using Nginx.

```dockerfile
FROM nginx:alpine

COPY . /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Nginx listens on port:

```
80
```

The host maps this to:

```
8080
```

Therefore, the frontend is accessed through:

```
http://localhost:8080
```

---

## 4. Docker Compose

Docker Compose runs all three services together:

- frontend
- backend
- postgres

The PostgreSQL database has a persistent Docker volume.

The backend waits for PostgreSQL to become healthy before starting.

The basic workflow is:

```text
docker compose up
        |
        +---- PostgreSQL starts
        |
        +---- Database initialized
        |
        +---- PostgreSQL becomes healthy
        |
        +---- Backend starts
        |
        +---- Backend connects to PostgreSQL
        |
        +---- Frontend starts through Nginx
```

---

## 5. Environment Variables

There are two different database environments.

### Local development

The normal `.env` can use:

```
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/chaos_theory_DB
```

This is used when PostgreSQL is running directly on the host machine.

### Docker environment

The Docker environment should use the Compose service name:

```
DATABASE_URL=postgresql://postgres:<password>@postgres:5432/chaos_theory_DB
```

Notice:

```
@postgres:5432
```

The word `postgres` refers to the PostgreSQL service inside Docker Compose.

Do **NOT** use:

```
@localhost:5432
```

for backend-to-database communication inside Docker.

---

## 6. Important Security Rule

Do **NOT** commit real credentials or API keys to GitHub.

Files such as:

```
.env
.docker.env
```

should be included in `.gitignore`.

Example:

```
.env
.env.*
```

If another developer needs the environment variables, provide an example file such as:

```
.env.example
```

containing placeholders:

```
DATABASE_URL=postgresql://postgres:<password>@postgres:5432/chaos_theory_DB
FORMSPREE_ID=your_formspree_id
```

---

## 7. First-Time Docker Setup

Make sure Docker Desktop is running.

Open PowerShell in the project root:

```powershell
cd D:\DEMO\demo1
```

Then build and start everything:

```powershell
docker compose up --build
```

The `--build` option tells Docker Compose to rebuild the frontend and backend images.

You should eventually see messages similar to:

```
Container chaos-theory-postgres Healthy
```

and:

```
Connected to PostgreSQL
```

The frontend should also show Nginx starting successfully.

---

## 8. Run Docker in Background

Instead of keeping the terminal attached to the logs, use:

```powershell
docker compose up --build -d
```

The `-d` means:

```
detached mode
```

Docker will continue running the containers in the background.

---

## 9. Check Running Containers

Use:

```powershell
docker compose ps
```

You should see something similar to:

```
NAME                    SERVICE       STATUS
chaos-theory-postgres   postgres      running
chaos-theory-backend    backend       running
chaos-theory-frontend   frontend      running
```

You can also use:

```powershell
docker ps
```

---

## 10. Access the Frontend

Once the containers are running, open:

```
http://localhost:8080
```

The frontend is served by Nginx.

---

## 11. Access the Backend

The backend runs on:

```
http://localhost:5000
```

The test route is:

```
http://localhost:5000/
```

It should return:

```
Server is running
```

The booking API is:

```
http://localhost:5000/api/bookings
```

The frontend sends booking submissions to this endpoint.

---

## 12. Application Workflow

When a user submits the booking form:

```text
User
 |
 v
Frontend
localhost:8080
 |
 | POST /api/bookings
 v
Backend
localhost:5000
 |
 +----------------------+
 |                      |
 v                      v
PostgreSQL           Formspree
 |
 v
bookings table
```

The backend:

1. Receives the booking data.
2. Inserts the booking into PostgreSQL.
3. Sends the submission to Formspree.
4. Returns the result to the frontend.

---

## 13. View Backend Logs

To see backend logs:

```powershell
docker compose logs backend
```

To continuously follow the logs:

```powershell
docker compose logs -f backend
```

Press:

```
Ctrl + C
```

to stop following the logs.

---

## 14. View PostgreSQL Logs

Use:

```powershell
docker compose logs postgres
```

Or continuously:

```powershell
docker compose logs -f postgres
```

---

## 15. View Frontend/Nginx Logs

Use:

```powershell
docker compose logs frontend
```

Or:

```powershell
docker compose logs -f frontend
```

---

## 16. View All Logs

To see logs from all services:

```powershell
docker compose logs
```

To continuously follow all services:

```powershell
docker compose logs -f
```

---

## 17. Access PostgreSQL Through Docker Terminal

One of the main advantages of this setup is that PostgreSQL does not require pgAdmin to access the database.

You can access PostgreSQL directly from the terminal.

Run:

```powershell
docker compose exec postgres psql -U postgres -d chaos_theory_DB
```

You should enter the PostgreSQL shell.

You will see something similar to:

```
psql (18.x)
Type "help" for help.

chaos_theory_DB=#
```

---

## 18. List Databases

Inside PostgreSQL:

```sql
\l
```

---

## 19. Connect to a Database

```sql
\c chaos_theory_DB
```

---

## 20. List Tables

```sql
\dt
```

You should see:

```
bookings
```

if the initialization script created the table.

---

## 21. View Booking Data

Run:

```sql
SELECT * FROM bookings;
```

This displays all booking submissions.

---

## 22. View Table Structure

Run:

```sql
\d bookings
```

This displays the columns, data types and other table information.

---

## 23. Exit PostgreSQL

To leave the PostgreSQL terminal:

```sql
\q
```

---

## 24. Access PostgreSQL Using docker exec

An alternative to `docker compose exec` is:

```powershell
docker exec -it chaos-theory-postgres psql -U postgres -d chaos_theory_DB
```

Both methods allow you to access PostgreSQL from the terminal.

The Compose version is generally easier to remember:

```powershell
docker compose exec postgres psql -U postgres -d chaos_theory_DB
```

---

## 25. PostgreSQL Persistent Storage

PostgreSQL uses a Docker named volume:

```
postgres_data
```

This means the database data survives container removal/recreation.

Check volumes:

```powershell
docker volume ls
```

You should see something similar to:

```
demo1_postgres_data
```

---

## 26. Stop the Application

To stop the running containers:

```powershell
docker compose stop
```

This stops the containers but does not remove them.

---

## 27. Start Again

After using `docker compose stop`, start the containers again with:

```powershell
docker compose start
```

---

## 28. Stop and Remove Containers

To stop and remove the Compose containers and network:

```powershell
docker compose down
```

The named PostgreSQL volume is normally preserved.

Therefore, your database data remains available.

You can start the application again with:

```powershell
docker compose up
```

---

## 29. Completely Reset the Database

> **WARNING:** This deletes the PostgreSQL Docker volume and therefore removes the database data stored in it. Use this only when you intentionally want a fresh database.

First:

```powershell
docker compose down
```

Then remove the volume:

```powershell
docker volume rm demo1_postgres_data
```

Then rebuild/start:

```powershell
docker compose up --build
```

PostgreSQL will initialize again.

The `database/init.sql` script will run during the fresh initialization.

---

## 30. Rebuild After Code Changes

If you modify the backend or frontend code, rebuild the images:

```powershell
docker compose up --build
```

Or in detached mode:

```powershell
docker compose up --build -d
```

---

## 31. Force a Clean Rebuild

If Docker appears to be using an old cached version:

```powershell
docker compose build --no-cache
```

Then:

```powershell
docker compose up
```

Or:

```powershell
docker compose up --build
```

---

## 32. Check Docker Images

List Docker images:

```powershell
docker images
```

You should see images similar to:

```
demo1-backend
demo1-frontend
postgres
```

---

## 33. Remove Unused Docker Resources

To see Docker disk usage:

```powershell
docker system df
```

To remove unused resources:

```powershell
docker system prune
```

Be careful with aggressive cleanup commands because they can remove resources that are still useful.

---

## 34. Typical Daily Workflow

After the Docker setup has already been created, the normal workflow is very simple.

**Step 1 — Open Docker Desktop**

Make sure Docker Desktop is running.

**Step 2 — Open the project**

```powershell
cd D:\DEMO\demo1
```

**Step 3 — Start the application**

```powershell
docker compose up -d
```

**Step 4 — Check containers**

```powershell
docker compose ps
```

**Step 5 — Open the website**

```
http://localhost:8080
```

**Step 6 — Test the backend**

```
http://localhost:5000/
```

Expected response:

```
Server is running
```

**Step 7 — Test a booking**

Submit the booking form through the frontend.

The submission should:

1. Reach the backend
2. Be inserted into PostgreSQL
3. Be sent through Formspree

**Step 8 — Check the database**

```powershell
docker compose exec postgres psql -U postgres -d chaos_theory_DB
```

Then:

```sql
SELECT * FROM bookings;
```

**Step 9 — Exit PostgreSQL**

```sql
\q
```

---

## 35. Quick Command Reference

| Action | Command |
|---|---|
| Start everything | `docker compose up` |
| Start in background | `docker compose up -d` |
| Build and start | `docker compose up --build` |
| Build and start in background | `docker compose up --build -d` |
| Check containers | `docker compose ps` |
| View all logs | `docker compose logs` |
| Follow all logs | `docker compose logs -f` |
| Backend logs | `docker compose logs backend` |
| PostgreSQL logs | `docker compose logs postgres` |
| Frontend logs | `docker compose logs frontend` |
| Stop containers | `docker compose stop` |
| Start stopped containers | `docker compose start` |
| Remove containers/network | `docker compose down` |
| PostgreSQL terminal | `docker compose exec postgres psql -U postgres -d chaos_theory_DB` |
| List tables | `\dt` |
| View bookings | `SELECT * FROM bookings;` |
| Describe bookings table | `\d bookings` |
| Exit PostgreSQL | `\q` |
| List Docker images | `docker images` |
| List Docker volumes | `docker volume ls` |
| Check Docker disk usage | `docker system df` |

---

## 36. Important Ports

| Component | Docker Port | Host Port | URL |
|---|---|---|---|
| Frontend / Nginx | 80 | 8080 | http://localhost:8080 |
| Backend / Node.js | 5000 | 5000 | http://localhost:5000 |
| PostgreSQL | 5432 | Internal Compose network | `postgres:5432` |

PostgreSQL does not need to be exposed to the host for the backend to communicate with it.

The backend communicates with PostgreSQL internally through:

```
postgres:5432
```

---

## 37. Important Docker Networking Concept

Inside Docker Compose:

```
localhost
```

means:

```
the current container
```

It does **NOT** mean another container.

Therefore, the backend should **NOT** connect to:

```
localhost:5432
```

Instead, it connects to:

```
postgres:5432
```

because `postgres` is the Compose service name.

**This is one of the most important concepts in this Docker setup.**

---

## 38. Database Initialization

The project contains:

```
database/init.sql
```

This file is mounted into:

```
/docker-entrypoint-initdb.d/init.sql
```

PostgreSQL automatically executes initialization scripts from this directory when the database is created for the first time.

For example:

```text
database/init.sql
        |
        v
PostgreSQL container
        |
        v
CREATE DATABASE / CREATE TABLE
```

If the PostgreSQL volume already contains a database, the initialization script will not automatically run again.

---

## 39. Development vs Docker Environment

The project maintains separate database connection settings.

**Local machine**

```
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/chaos_theory_DB
```

**Docker**

```
DATABASE_URL=postgresql://postgres:<password>@postgres:5432/chaos_theory_DB
```

The difference is the hostname:

```
localhost
```

versus:

```
postgres
```

---

## 40. Complete Startup Checklist

Before starting the project:

- [ ] Docker Desktop is running
- [ ] `.docker.env` contains the correct database credentials
- [ ] `docker-compose.yml` uses the same PostgreSQL credentials
- [ ] `database/init.sql` exists
- [ ] Frontend Dockerfile exists
- [ ] Backend Dockerfile exists

Then run:

```powershell
docker compose up --build -d
```

Check:

```powershell
docker compose ps
```

Then open:

```
http://localhost:8080
```

Test backend:

```
http://localhost:5000/
```

Submit a booking.

Check PostgreSQL:

```powershell
docker compose exec postgres psql -U postgres -d chaos_theory_DB
```

Then:

```sql
SELECT * FROM bookings;
```

Exit:

```sql
\q
```

---

## 41. Troubleshooting

### PostgreSQL authentication error

If you see:

```
password authentication failed for user "postgres"
```

check that:

```
POSTGRES_PASSWORD
```

in `docker-compose.yml` matches the password in the backend's `.docker.env`.

If the PostgreSQL volume was already initialized with a different password, changing the environment variable alone may not change the existing database password.

For a completely fresh development database:

```powershell
docker compose down
docker volume rm demo1_postgres_data
docker compose up --build
```

> **WARNING:** this deletes the existing database volume.

### Backend cannot connect to PostgreSQL

If you see:

```
ECONNREFUSED
```

make sure the backend uses:

```
postgres:5432
```

instead of:

```
localhost:5432
```

Also check:

```powershell
docker compose ps
```

and make sure PostgreSQL is healthy.

### Frontend is not loading

Check:

```powershell
docker compose ps
```

Then:

```powershell
docker compose logs frontend
```

The frontend should be available at:

```
http://localhost:8080
```

### Backend is not starting

Check:

```powershell
docker compose logs backend
```

Then rebuild:

```powershell
docker compose up --build
```

### Old code appears after rebuilding

Try:

```powershell
docker compose build --no-cache
docker compose up
```

---

## 42. Final Verification

A successful Docker deployment should have:

```text
Frontend
   ↓
http://localhost:8080
   ↓
Backend
   ↓
http://localhost:5000
   ↓
PostgreSQL
   ↓
bookings table
```

A successful booking should result in:

```text
Booking Form
      ↓
POST /api/bookings
      ↓
Express Backend
      ↓
PostgreSQL INSERT
      ↓
Formspree submission
      ↓
Success response
```

The booking can then be verified using:

```powershell
docker compose exec postgres psql -U postgres -d chaos_theory_DB
```

and:

```sql
SELECT * FROM bookings;
```

---

## 43. One-Command Startup

Once everything has already been configured, the main command to remember is:

```powershell
docker compose up -d
```

Then open:

```
http://localhost:8080
```

That's it.

To shut everything down:

```powershell
docker compose down
```

For development, the most commonly used commands are therefore:

```powershell
docker compose up -d
docker compose ps
docker compose logs -f
docker compose down
```

And to access the database:

```powershell
docker compose exec postgres psql -U postgres -d chaos_theory_DB
```

---

## Dockerized Stack Summary

| Layer | Technology |
|---|---|
| Frontend | HTML + CSS + JavaScript |
| Web Server | Nginx Alpine |
| Backend | Node.js |
| Framework | Express.js |
| Database | PostgreSQL 18 |
| Database Driver | pg |
| Email | Formspree |
| Containerization | Docker |
| Orchestration | Docker Compose |
| Database Storage | Docker Named Volume |
| Database Initialization | `database/init.sql` |

The entire application can therefore be started using Docker Compose without manually starting the frontend, backend, or PostgreSQL separately.

---

## The Short Version You'll Actually Use Most of the Time

After you've got this README in GitHub, you really only need to remember this workflow:

```powershell
cd D:\DEMO\demo1

docker compose up --build -d

docker compose ps
```

Then:

- **Website:** http://localhost:8080
- **Backend:** http://localhost:5000
- **Database terminal:**

```powershell
docker compose exec postgres psql -U postgres -d chaos_theory_DB
```

Then:

```sql
SELECT * FROM bookings;
```

And when you're done:

```powershell
docker compose down
```

That's a pretty solid Docker setup — especially because you've actually verified the complete chain: **form → Express → PostgreSQL → Formspree/email**, rather than just checking that the containers happen to be running.