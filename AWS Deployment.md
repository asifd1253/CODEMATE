# CODEMATE --- AWS EC2 Deployment Guide

This document records the deployment steps completed so far for
**CODEMATE**, a full-stack application with a React/Vite frontend and a
Node.js/Express backend.

> **Deployment status:** The frontend has been served through Nginx on
> the EC2 instance, and the backend has been started with PM2. The
> backend has connected successfully to MongoDB Atlas. This guide
> describes the setup up to the current stage; HTTPS, a custom domain,
> and other production-hardening steps are not included.

------------------------------------------------------------------------

## 1. Project overview

-   **Repository:** https://github.com/asifd1253/CODEMATE.git

-   **Repository layout:**

    ``` text
    CODEMATE/
    ├── backend/
    │   ├── src/
    │   │   └── app.js
    │   └── package.json
    └── frontend/
        ├── src/
        ├── package.json
        └── ...
    ```

-   **Frontend:** React + Vite

-   **Backend:** Node.js + Express

-   **Database:** MongoDB Atlas

-   **Server:** AWS EC2 (Ubuntu)

-   **Web server / reverse proxy:** Nginx

-   **Backend process manager:** PM2

-   **Node.js:** v22.13.1 (installed through NVM)

-   **Public IP used during setup:** `3.26.50.89`

-   **Frontend URL:** `http://3.26.50.89`

The frontend is built into static files and served by Nginx. Nginx also
forwards API requests to the backend running locally on port `3000`. PM2
keeps the backend process running.

## 2. Request flow

``` text
Browser
  |
  | HTTP: http://3.26.50.89
  v
AWS EC2 — Ubuntu
  |
  v
Nginx (port 80)
  |
  +---- / and frontend routes ----> /var/www/html (React build)
  |
  +---- /api/* -------------------> http://localhost:3000/*
                                      |
                                      v
                                Node.js / Express
                                      |
                                      v
                                MongoDB Atlas
```

The Nginx configuration uses a trailing slash in `proxy_pass`:

``` nginx
proxy_pass http://localhost:3000/;
```

With `location /api/`, this removes the `/api/` prefix before forwarding
the request. For example, `/api/signup` is forwarded to the backend as
`/signup`. This matches an Express application whose routes are mounted
at `/`.

------------------------------------------------------------------------

## 3. Before starting

You need:

1.  An AWS account and an Ubuntu EC2 instance.
2.  The EC2 key pair (`.pem`) file used when creating the instance.
3.  GitHub access to the CODEMATE repository.
4.  A MongoDB Atlas database and its connection string.
5.  The EC2 security group configured to allow:
    -   **SSH (TCP 22):** preferably only from your own IP.
    -   **HTTP (TCP 80):** from the internet for the public website.
    -   Do **not** expose backend port `3000` publicly when Nginx
        proxies to it locally.

Never commit the `.pem` file, database credentials, JWT secrets, or
`.env` files to GitHub.

------------------------------------------------------------------------

## 4. Connect to EC2 from Windows PowerShell

Run this command in **Windows PowerShell**, replacing the key path and
username if yours differ:

``` powershell
ssh -i "C:\path\to\codemate-secret.pem" ubuntu@3.26.50.89
```

For example, if the key is in the current directory:

``` powershell
ssh -i .\codemate-secret.pem ubuntu@3.26.50.89
```

The `ubuntu` username is commonly used for Ubuntu EC2 instances. Once
connected, commands in the following sections are run in the **EC2
Ubuntu terminal**, unless stated otherwise.

------------------------------------------------------------------------

## 5. Update Ubuntu and install required tools

Update the package list and install Git, curl, and Nginx:

``` bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y git curl nginx
```

Check Nginx:

``` bash
sudo systemctl status nginx
```

Useful Nginx service commands:

``` bash
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo systemctl enable nginx
```

`enable` configures Nginx to start automatically when the server boots.

------------------------------------------------------------------------

## 6. Install Node.js using NVM

Node.js was installed through NVM so that it is managed for the Ubuntu
user rather than installed as a system-wide Node version.

Install NVM (if it is not already installed):

``` bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Load NVM in the current shell:

``` bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
```

Install and select Node.js 22:

``` bash
nvm install 22.13.1
nvm use 22.13.1
nvm alias default 22.13.1
```

Verify the versions:

``` bash
node -v
npm -v
```

The Node.js version used during this deployment was `v22.13.1`.

If `nvm` is not found after reconnecting, open a new SSH session or load
it with the `export` and `source` commands above.

------------------------------------------------------------------------

## 7. Clone the repository

Clone the repository on EC2:

``` bash
cd ~
git clone https://github.com/asifd1253/CODEMATE.git
cd ~/CODEMATE
```

If the repository is already cloned, do not clone it again. Go into the
existing directory:

``` bash
cd ~/CODEMATE
```

Check the current branch and working tree before pulling:

``` bash
git branch --show-current
git status
git branch -a
```

Pull the branch that contains the deployment changes. For example:

``` bash
git pull origin main
```

If the changes are on `EPISODE-19` instead of `main`, use:

``` bash
git pull origin EPISODE-19
```

Use the branch that actually contains your latest changes. Do not
blindly pull `main` if the required changes have not been merged into
it.

### Push local changes from Windows

Run these commands in the local project terminal (Windows), from the
repository root:

``` bash
git status
git add .
git commit -m "Describe the changes"
git push -u origin EPISODE-19
```

Replace `EPISODE-19` with the branch you are pushing. If Git reports
that the push was rejected because the remote contains work you do not
have, first inspect the branch and remote changes rather than
force-pushing.

------------------------------------------------------------------------

## 8. Install backend dependencies and run the backend

On EC2:

``` bash
cd ~/CODEMATE/backend
npm install
```

Check the backend entry point. In this project, the entry point used to
start the app is:

``` text
backend/src/app.js
```

Start it directly for an initial test:

``` bash
node src/app.js
```

Check the terminal output. During setup, the backend successfully
connected to MongoDB and reported that the server was listening on port
`3000`.

Stop a foreground test with `Ctrl+C` before starting it with PM2.

### Environment variables

The backend needs its required environment variables, including the
MongoDB connection string and any secrets used by the application. Keep
these in the backend's environment configuration (commonly
`backend/.env`) and make sure the application loads them.

Example only --- use the exact variable names already referenced by your
code:

``` dotenv
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=replace_with_a_long_random_secret
```

Do not paste real secrets into this README or commit them to Git. If
your code uses different names, keep the names consistent with the code.

For MongoDB Atlas, ensure the database user and Atlas network access
rules permit the EC2 instance to connect. Avoid using an unrestricted
network rule unless you understand the security implications.

------------------------------------------------------------------------

## 9. Run the backend with PM2

Install PM2 globally for the NVM-managed Node installation:

``` bash
npm install -g pm2
```

Do not add `sudo` to this command when using NVM; doing so can install
PM2 under a different Node environment.

Start the backend from the backend directory:

``` bash
cd ~/CODEMATE/backend
pm2 start src/app.js --name codemate-backend
```

Check the process:

``` bash
pm2 status
pm2 logs codemate-backend
```

Other useful PM2 commands:

``` bash
pm2 restart codemate-backend
pm2 stop codemate-backend
pm2 delete codemate-backend
pm2 describe codemate-backend
```

Save the current process list:

``` bash
pm2 save
```

### Configure PM2 to start after a reboot

Run:

``` bash
pm2 startup
```

PM2 prints a command that must be run with `sudo`. Copy and execute the
exact command printed by your EC2 terminal. Then run:

``` bash
pm2 save
```

Do not copy a guessed `pm2 startup` command from another machine: the
generated command can depend on the installed Node/NVM paths and
username.

------------------------------------------------------------------------

## 10. Configure the frontend API base URL

The frontend must send API requests through Nginx rather than directly
to `localhost:3000` or the EC2 public IP with port `3000`.

Set the frontend API base URL to:

``` js
const BASE_URL = "/api";
```

Use the actual constants/configuration file in the frontend project.
Keep the existing API request paths consistent with this base URL.

For example, if the frontend uses:

``` js
axios.post(BASE_URL + "/signup", payload);
```

the browser requests `/api/signup`, and Nginx forwards it to the backend
as `/signup`.

Rebuild the frontend after changing the API base URL.

------------------------------------------------------------------------

## 11. Configure Nginx

The Nginx default site was configured to serve the frontend build from
`/var/www/html` and proxy API requests to the backend.

Open the default site configuration:

``` bash
sudo nano /etc/nginx/sites-available/default
```

Replace the site configuration with the following, adjusting
`server_name` if the public IP or domain changes:

``` nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name 3.26.50.89;

    root /var/www/html;
    index index.html;

    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Save in Nano:

1.  Press `Ctrl+O` to write the file.
2.  Press `Enter` to confirm the filename.
3.  Press `Ctrl+X` to exit.

Test the configuration before reloading:

``` bash
sudo nginx -t
```

If the test reports that the configuration is successful, restart Nginx:

``` bash
sudo systemctl restart nginx
```

Check its status:

``` bash
sudo systemctl status nginx
```

If `nginx -t` reports an error, fix the reported line before restarting
Nginx.

### What the Nginx locations do

-   `location /api/`: forwards API calls to the backend on port `3000`.
-   `proxy_pass http://localhost:3000/;`: the ending slash causes Nginx
    to remove the matched `/api/` prefix when forwarding.
-   `location /`: serves static frontend files and falls back to
    `index.html`, which supports React client-side routes.

------------------------------------------------------------------------

## 12. Build and deploy the frontend

On EC2, install frontend dependencies and create a production build:

``` bash
cd ~/CODEMATE/frontend
npm install
npm run build
```

Vite normally creates the production build in `frontend/dist`.

Copy the built files into the Nginx document root:

``` bash
sudo cp -r dist/. /var/www/html/
```

Restart Nginx:

``` bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

Open the application in a browser:

``` text
http://3.26.50.89
```

If you make frontend changes later, rebuild and copy the new build
again.

------------------------------------------------------------------------

## 13. Updating the deployment

When new code is pushed to the GitHub branch used by the EC2 deployment,
connect to EC2 and update the repository.

First check the branch:

``` bash
cd ~/CODEMATE
git branch --show-current
git status
```

Pull the appropriate branch. Example for `EPISODE-19`:

``` bash
git pull origin EPISODE-19
```

### If only the frontend changed

``` bash
cd ~/CODEMATE/frontend
npm install
npm run build
sudo cp -r dist/. /var/www/html/
sudo systemctl restart nginx
```

### If only the backend changed

``` bash
cd ~/CODEMATE/backend
npm install
pm2 restart codemate-backend
pm2 logs codemate-backend
```

### If both frontend and backend changed

``` bash
cd ~/CODEMATE/frontend
npm install
npm run build
sudo cp -r dist/. /var/www/html/

cd ~/CODEMATE/backend
npm install
pm2 restart codemate-backend

sudo nginx -t
sudo systemctl restart nginx
```

If the backend dependencies changed, `npm install` should be run before
restarting PM2.

------------------------------------------------------------------------

## 14. Troubleshooting

### Website does not open

Check the EC2 instance and security group. Make sure inbound HTTP TCP
port `80` is allowed.

On EC2:

``` bash
sudo systemctl status nginx
sudo nginx -t
```

### Nginx configuration errors

``` bash
sudo nginx -t
sudo journalctl -u nginx --no-pager -n 50
```

Correct the reported configuration error and test again before
restarting.

### Backend is not running

``` bash
pm2 status
pm2 logs codemate-backend
```

Restart it if needed:

``` bash
pm2 restart codemate-backend
```

### Backend cannot connect to MongoDB

Check the backend logs:

``` bash
pm2 logs codemate-backend
```

Confirm that the environment variables are present, the connection
string is correct, the Atlas database user is valid, and the Atlas
network access rules permit the EC2 connection.

### API returns 404

Check all three parts:

1.  The frontend request path, including the `/api` base URL.
2.  The Nginx `location /api/` and trailing slash in `proxy_pass`.
3.  The Express route paths and how routers are mounted in `app.js`.

For this configuration, `/api/some-route` is forwarded to Express as
`/some-route`.

### Linux reports "module not found" even though it works on Windows

Linux filenames are case-sensitive; Windows often is not. Make sure
import paths match the actual filename exactly. For example,
`../models/user.js` and `../models/User.js` are different paths on
Linux.

Use one consistent filename casing throughout the project. Also avoid
importing the same model through differently cased paths, which can lead
to a Mongoose `OverwriteModelError` when the model is registered more
than once.

### Check whether the backend is listening on port 3000

``` bash
sudo ss -ltnp | grep :3000
```

The backend does not need port `3000` open to the public internet when
Nginx and the backend run on the same EC2 instance.

------------------------------------------------------------------------

## 15. Useful command reference

  ----------------------------------------------------------------------------------------------
  Task                                Command
  ----------------------------------- ----------------------------------------------------------
  Connect from Windows                `ssh -i .\codemate-secret.pem ubuntu@3.26.50.89`

  Go to repository                    `cd ~/CODEMATE`

  Check current branch                `git branch --show-current`

  Pull a branch                       `git pull origin <branch>`

  Check Node                          `node -v`

  Check npm                           `npm -v`

  Install backend packages            `cd ~/CODEMATE/backend && npm install`

  Start backend with PM2              `pm2 start src/app.js --name codemate-backend`

  View PM2 status                     `pm2 status`

  View backend logs                   `pm2 logs codemate-backend`

  Restart backend                     `pm2 restart codemate-backend`

  Save PM2 processes                  `pm2 save`

  Build frontend                      `cd ~/CODEMATE/frontend && npm install && npm run build`

  Copy frontend build                 `sudo cp -r dist/. /var/www/html/`

  Test Nginx                          `sudo nginx -t`

  Restart Nginx                       `sudo systemctl restart nginx`

  Check Nginx                         `sudo systemctl status nginx`
  ----------------------------------------------------------------------------------------------

------------------------------------------------------------------------

## 16. Current deployment checklist

-   [x] Create and connect to an Ubuntu EC2 instance.
-   [x] Install Git, curl, and Nginx.
-   [x] Install Node.js 22.13.1 using NVM.
-   [x] Clone the CODEMATE repository.
-   [x] Install backend dependencies.
-   [x] Resolve Linux filename casing issues in model imports.
-   [x] Start the backend and confirm MongoDB connection.
-   [x] Run the backend using PM2.
-   [x] Configure Nginx to serve the frontend and proxy `/api/` to port
    `3000`.
-   [x] Build and copy the frontend into `/var/www/html`.
-   [x] Open the app using the EC2 public IP.

Items to verify or complete as needed:

-   [ ] Confirm `pm2 startup` was configured using the command printed
    on the EC2 instance.
-   [ ] Confirm the latest intended Git branch is deployed.
-   [ ] Test signup, login, profile, feed, and other API-dependent
    features from the public website.
-   [ ] Configure HTTPS with a domain and TLS certificate if the app
    will be used beyond testing.
-   [ ] Review production environment variables, CORS, logging, backups,
    and EC2 security settings.

------------------------------------------------------------------------

## 17. Important security notes

-   Keep the EC2 private key (`.pem`) secure and never commit it.
-   Never commit `.env` files or expose MongoDB credentials, JWT
    secrets, or other tokens.
-   Keep the backend port `3000` private; expose HTTP/HTTPS through
    Nginx.
-   Restrict SSH access to trusted IP addresses where possible.
-   HTTP does not encrypt traffic. Use HTTPS before handling real user
    credentials or sensitive data.
-   Make sure the MongoDB Atlas network access configuration is as
    restrictive as your deployment allows.
