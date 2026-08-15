# Chaos Theory Backend --- Docker Guide

This README contains the Docker commands needed to build, run, test,
stop, and rebuild the backend.

The backend is a **Node.js + Express + PostgreSQL** application.

## 1. Project Docker files

The backend uses:

``` text
backend/
├── Dockerfile
├── .dockerignore
├── .docker.env          # Local Docker environment variables — DO NOT COMMIT
├── .env                 # Normal local environment variables — DO NOT COMMIT
├── package.json
├── package-lock.json
├── server.js
├── db.js
└── routes/
    └── bookings.js
```

### Important

`.env` and `.docker.env` contain environment variables/secrets and
should **not** be committed to GitHub.

For Git:

``` gitignore
.env
.docker.env
.env.*
```

For Docker:

``` dockerignore
.env
.env.*
.docker.env
```

------------------------------------------------------------------------

# 2. Dockerfile

The current backend Dockerfile is:

``` dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 5000

CMD ["npm","start"]
```

This:

1.  Uses Node.js 22 Alpine.
2.  Creates `/app` inside the container.
3.  Copies `package.json` and `package-lock.json`.
4.  Installs production dependencies.
5.  Copies the backend source code.
6.  Exposes port `5000`.
7.  Starts the backend with `npm start`.

------------------------------------------------------------------------

# 3. Environment files

## Normal development

When running the backend directly with Node:

``` bash
npm start
```

the PostgreSQL connection can use:

``` env
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME
```

## Docker development

When PostgreSQL is running on the Windows host and the backend is
running inside Docker, use:

``` env
DATABASE_URL=postgresql://USERNAME:PASSWORD@host.docker.internal:5432/DATABASE_NAME
```

in `.docker.env`.

`host.docker.internal` allows the Docker container to reach services
running on the host machine.

Example `.docker.env`:

``` env
PORT=5000
DATABASE_URL=postgresql://USERNAME:PASSWORD@host.docker.internal:5432/DATABASE_NAME
FORMSPREE_ID=YOUR_FORMSPREE_ID
```

Do not copy real credentials into this README.

------------------------------------------------------------------------

# 4. Build the Docker image

Open PowerShell in the `backend` directory:

``` powershell
cd D:\DEMO\demo1\backend
```

Build the image:

``` powershell
docker build -t chaos-theory-backend .
```

### Check that the image exists

``` powershell
docker images
```

You should see:

``` text
chaos-theory-backend
```

------------------------------------------------------------------------

# 5. Run the backend container

Run:

``` powershell
docker run --env-file .docker.env -p 5000:5000 chaos-theory-backend
```

Explanation:

  Part                       Meaning
  -------------------------- --------------------------------------------
  `docker run`               Creates and starts a container
  `--env-file .docker.env`   Loads environment variables
  `-p 5000:5000`             Maps host port 5000 to container port 5000
  `chaos-theory-backend`     Docker image name

A successful startup should look approximately like:

``` text
Server running on http://localhost:5000
Connected to PostgreSQL
```

------------------------------------------------------------------------

# 6. Run the container in the background

Instead of keeping the terminal occupied, use detached mode:

``` powershell
docker run -d --env-file .docker.env -p 5000:5000 --name chaos-theory-backend-container chaos-theory-backend
```

The `-d` means detached mode.

The `--name` gives the container a predictable name.

------------------------------------------------------------------------

# 7. Check running containers

``` powershell
docker ps
```

You should see something similar to:

``` text
CONTAINER ID   IMAGE                   PORTS
xxxxxxxxxxxx   chaos-theory-backend   0.0.0.0:5000->5000/tcp
```

If the container is not running, check all containers:

``` powershell
docker ps -a
```

------------------------------------------------------------------------

# 8. Check backend logs

If the container is running in detached mode:

``` powershell
docker logs chaos-theory-backend-container
```

To continuously watch the logs:

``` powershell
docker logs -f chaos-theory-backend-container
```

Press:

``` text
Ctrl + C
```

to stop watching the logs.

You should see:

``` text
Server running on http://localhost:5000
Connected to PostgreSQL
```

------------------------------------------------------------------------

# 9. Test the backend

The backend has a test route:

``` text
GET /
```

Open this in your browser:

``` text
http://localhost:5000/
```

Expected response:

``` text
Server is running
```

You can also test from PowerShell:

``` powershell
Invoke-WebRequest http://localhost:5000/
```

or:

``` powershell
curl http://localhost:5000/
```

------------------------------------------------------------------------

# 10. Test the booking API

The booking endpoint is:

``` text
POST /api/bookings
```

Example PowerShell request:

``` powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    contact_number = "1234567890"
    institution_type = "College"
    program_type = "Test Program"
    start_date = "2026-08-20"
} | ConvertTo-Json

Invoke-WebRequest `
    -Uri http://localhost:5000/api/bookings `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

This should:

1.  Send the booking to the Express backend.
2.  Insert the booking into PostgreSQL.
3.  Send the submission to Formspree.
4.  Return a JSON response.

A successful response should contain:

``` json
{
  "success": true,
  "booking": {},
  "emailSent": true
}
```

`emailSent` may be `false` if Formspree fails, while the PostgreSQL
insertion can still have succeeded.

------------------------------------------------------------------------

# 11. Stop the container

If you are running the container in the foreground:

``` text
Ctrl + C
```

If it is running in detached mode:

``` powershell
docker stop chaos-theory-backend-container
```

------------------------------------------------------------------------

# 12. Start an existing stopped container

If you stopped the container and want to start it again:

``` powershell
docker start chaos-theory-backend-container
```

Then check:

``` powershell
docker ps
```

And logs:

``` powershell
docker logs chaos-theory-backend-container
```

------------------------------------------------------------------------

# 13. Remove the container

Stop it first if necessary:

``` powershell
docker stop chaos-theory-backend-container
```

Then remove it:

``` powershell
docker rm chaos-theory-backend-container
```

Removing a container does **not** remove the Docker image.

------------------------------------------------------------------------

# 14. Rebuild after changing backend code

This is important.

If you modify:

-   `server.js`
-   `db.js`
-   `routes/bookings.js`
-   `package.json`
-   other backend source files

the already-built Docker image does not automatically update.

Build the image again:

``` powershell
docker build -t chaos-theory-backend .
```

Then create a new container:

``` powershell
docker run -d `
  --env-file .docker.env `
  -p 5000:5000 `
  --name chaos-theory-backend-container `
  chaos-theory-backend
```

If a container with that name already exists, remove it first:

``` powershell
docker stop chaos-theory-backend-container
docker rm chaos-theory-backend-container
```

Then run the new one.

------------------------------------------------------------------------

# 15. Rebuild without using Docker cache

Normally Docker uses cached layers to make builds faster.

If you want a completely fresh build:

``` powershell
docker build --no-cache -t chaos-theory-backend .
```

Use this when you suspect Docker is using an old dependency or source
layer.

------------------------------------------------------------------------

# 16. Check Docker images

``` powershell
docker images
```

Find:

``` text
chaos-theory-backend
```

Remove an old image if necessary:

``` powershell
docker rmi chaos-theory-backend
```

Only do this if no container depends on that image.

------------------------------------------------------------------------

# 17. Useful container commands

### Enter the running container

``` powershell
docker exec -it chaos-theory-backend-container sh
```

You will get a shell inside the Alpine Linux container.

Exit with:

``` bash
exit
```

### Inspect the container

``` powershell
docker inspect chaos-theory-backend-container
```

### Check resource usage

``` powershell
docker stats chaos-theory-backend-container
```

------------------------------------------------------------------------

# 18. Quick Docker workflow

For normal development, the commands you will use most often are:

### First time

``` powershell
docker build -t chaos-theory-backend .
```

``` powershell
docker run -d --env-file .docker.env -p 5000:5000 --name chaos-theory-backend-container chaos-theory-backend
```

``` powershell
docker ps
```

``` powershell
docker logs chaos-theory-backend-container
```

Then test:

``` text
http://localhost:5000/
```

------------------------------------------------------------------------

# 19. After changing code

``` powershell
docker stop chaos-theory-backend-container
docker rm chaos-theory-backend-container
docker build -t chaos-theory-backend .
docker run -d --env-file .docker.env -p 5000:5000 --name chaos-theory-backend-container chaos-theory-backend
```

Then:

``` powershell
docker logs chaos-theory-backend-container
```

and test:

``` text
http://localhost:5000/
```

------------------------------------------------------------------------

# 20. Troubleshooting

## Container immediately stops

Check:

``` powershell
docker ps -a
```

Then:

``` powershell
docker logs chaos-theory-backend-container
```

Look for the actual application error.

------------------------------------------------------------------------

## PostgreSQL connection refused

If PostgreSQL is running directly on Windows and the backend is inside
Docker, make sure `.docker.env` uses:

``` env
DATABASE_URL=postgresql://USERNAME:PASSWORD@host.docker.internal:5432/DATABASE_NAME
```

Do not use:

``` env
DATABASE_URL=postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME
```

inside the Docker environment.

Inside a container, `localhost` refers to the **container itself**, not
your Windows host.

------------------------------------------------------------------------

## Port 5000 already in use

Check what is using port 5000:

``` powershell
docker ps
```

If another container is using it, stop that container.

Alternatively, map a different host port:

``` powershell
docker run -d --env-file .docker.env -p 5001:5000 --name chaos-theory-backend-container chaos-theory-backend
```

Then access:

``` text
http://localhost:5001/
```

The application still listens on port `5000` inside the container.

------------------------------------------------------------------------

# 21. Check whether environment files are ignored by Git

Run:

``` powershell
git status
```

`.env` and `.docker.env` should **not** appear as untracked files.

You can also verify:

``` powershell
git check-ignore -v .env
```

``` powershell
git check-ignore -v .docker.env
```

They should show that the files are being ignored by `.gitignore`.

------------------------------------------------------------------------

# 22. Git/Docker files that should be committed

These files should normally be committed:

``` text
Dockerfile
.dockerignore
.gitignore
```

These should NOT be committed:

``` text
.env
.docker.env
node_modules/
```

------------------------------------------------------------------------

# 23. Current backend Docker architecture

At the moment, the local setup is:

``` text
                    Windows Host
                ┌───────────────────┐
                │                   │
                │  PostgreSQL       │
                │      :5432        │
                │                   │
                └─────────▲─────────┘
                          │
                  host.docker.internal
                          │
                ┌─────────┴─────────┐
                │   Docker          │
                │                   │
                │ Node.js + Express │
                │       :5000       │
                │                   │
                └─────────▲─────────┘
                          │
                          │
                    localhost:5000
                          │
                       Browser
```

This setup is suitable for **local Docker development**.

For production deployment, the PostgreSQL connection will normally point
to a managed database or another Docker/service network rather than
`host.docker.internal`.

------------------------------------------------------------------------

# 24. Quick reference

  ----------------------------------------------------------------------------------------------------------------------------------------------------
  Task                                Command
  ----------------------------------- ----------------------------------------------------------------------------------------------------------------
  Build image                         `docker build -t chaos-theory-backend .`

  List images                         `docker images`

  Run container                       `docker run -d --env-file .docker.env -p 5000:5000 --name chaos-theory-backend-container chaos-theory-backend`

  List running containers             `docker ps`

  List all containers                 `docker ps -a`

  View logs                           `docker logs chaos-theory-backend-container`

  Follow logs                         `docker logs -f chaos-theory-backend-container`

  Stop container                      `docker stop chaos-theory-backend-container`

  Start container                     `docker start chaos-theory-backend-container`

  Remove container                    `docker rm chaos-theory-backend-container`

  Rebuild image                       `docker build -t chaos-theory-backend .`

  Rebuild without cache               `docker build --no-cache -t chaos-theory-backend .`

  Enter container                     `docker exec -it chaos-theory-backend-container sh`

  Inspect container                   `docker inspect chaos-theory-backend-container`

  Container resource usage            `docker stats chaos-theory-backend-container`

  Test API                            `http://localhost:5000/`
  ----------------------------------------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## The one command sequence to remember

If you forget everything else, this is the main local Docker workflow:

``` powershell
docker build -t chaos-theory-backend .
```

``` powershell
docker run -d --env-file .docker.env -p 5000:5000 --name chaos-theory-backend-container chaos-theory-backend
```

``` powershell
docker ps
```

``` powershell
docker logs chaos-theory-backend-container
```

Then open:

``` text
http://localhost:5000/
```

If the response is:

``` text
Server is running
```

and the logs show:

``` text
Connected to PostgreSQL
```

your Dockerized backend is working correctly.
