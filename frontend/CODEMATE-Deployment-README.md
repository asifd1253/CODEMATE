# CODEMATE Deployment on AWS EC2

This README documents the deployment steps completed so far.

## 1. Deployment overview

-   **Application:** CODEMATE
-   **Domain:** `code-mate.in`
-   **WWW domain:** `www.code-mate.in`
-   **EC2 public IPv4:** `3.26.50.89`
-   **AWS region:** Asia Pacific (Sydney), `ap-southeast-2`
-   **Server:** Ubuntu
-   **Frontend:** React + Vite
-   **Backend:** Node.js + Express
-   **Database:** MongoDB Atlas
-   **Web server / reverse proxy:** Nginx
-   **Process manager:** PM2
-   **DNS and proxy:** Cloudflare
-   **TLS certificate:** Let's Encrypt via Certbot

### Request flow

``` text
Browser
  |
  | HTTPS
  v
Cloudflare
  |
  | HTTPS (443)
  v
AWS EC2 (Ubuntu)
  |
  v
Nginx
  |                         \
  | Frontend                  \ /api/ requests
  v                            v
/var/www/html              Node.js / Express
                             (port 3000)
                                  |
                                  v
                             MongoDB Atlas
```

Nginx serves the built React frontend and forwards `/api/` requests to
the Express backend.

## 2. Create and connect to EC2

An Ubuntu EC2 instance was created in `ap-southeast-2`. The instance was
accessed from Windows PowerShell using the downloaded PEM key.

Example SSH command (adjust the key path if necessary):

``` powershell
ssh -i "C:\path\to\codemate-secret.pem" ubuntu@3.26.50.89
```

### Security group inbound rules

The inbound rules used during this setup:

  Type         Protocol     Port Source
  ------------ ---------- ------ -------------------------------------
  SSH          TCP            22 `0.0.0.0/0` as currently configured
  Custom TCP   TCP          3000 `0.0.0.0/0`
  HTTP         TCP            80 `0.0.0.0/0`
  HTTPS        TCP           443 `0.0.0.0/0`

Port `3000` is intentionally being kept open to follow the tutorial. For
improved security, public access to it can be removed later because
Nginx proxies API traffic to the backend. SSH should ideally be
restricted to your own IP address.

## 3. Install server packages

Run these commands in the **Ubuntu SSH terminal**:

``` bash
sudo apt update
sudo apt install -y git curl nginx
```

Check Nginx:

``` bash
sudo systemctl status nginx
```

Nginx should show as active/running.

## 4. Install Node.js using NVM

The local project used Node.js `v22.13.1`, so the same version was
installed on EC2 using NVM.

Install NVM if it is not already installed:

``` bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
```

Install and use Node.js:

``` bash
nvm install 22.13.1
nvm use 22.13.1
node -v
npm -v
```

## 5. Clone the GitHub repository

The project uses one repository with separate `backend/` and `frontend/`
directories:

``` text
CODEMATE/
├── backend/
└── frontend/
```

Clone it on EC2:

``` bash
cd ~
git clone https://github.com/asifd1253/CODEMATE.git
cd ~/CODEMATE
```

Check the checked-out branch:

``` bash
git branch --show-current
```

Pull the branch that contains the code you intend to deploy. For
example:

``` bash
git pull origin main
```

If your latest changes are on another branch (for example,
`EPISODE-19`), use that branch instead. Push the changes to GitHub
before pulling them on EC2.

## 6. Configure and run the backend

The backend is in `backend/`, and the PM2 entry point used is
`src/app.js`.

Install dependencies:

``` bash
cd ~/CODEMATE/backend
npm install
```

Configure the backend's production environment variables on EC2,
including the MongoDB Atlas connection string and any secrets required
by the app. Use the exact variable names expected by your code. Do not
commit `.env` files, passwords, JWT secrets, or database credentials to
GitHub.

The backend listens on port `3000`. Its logs showed a successful MongoDB
connection and that the server was listening on port `3000`.

### PM2

Install PM2 globally under the NVM-managed Node installation:

``` bash
npm install -g pm2
```

Start the backend:

``` bash
cd ~/CODEMATE/backend
pm2 start src/app.js --name codemate-backend
```

Useful commands:

``` bash
pm2 status
pm2 logs codemate-backend
pm2 restart codemate-backend
pm2 stop codemate-backend
```

Save the process list:

``` bash
pm2 save
```

To configure PM2 to start after a reboot:

``` bash
pm2 startup
```

Run the startup command printed by PM2, then save the process list
again:

``` bash
pm2 save
```

## 7. Build and deploy the frontend

The frontend is a React + Vite app in `frontend/`. Its API base URL was
changed to `/api`, so browser API requests go through the same domain
and Nginx.

Build the frontend on EC2:

``` bash
cd ~/CODEMATE/frontend
npm install
npm run build
```

Vite creates the production build in `frontend/dist/`. Copy the build
contents to Nginx's web root:

``` bash
sudo cp -r dist/. /var/www/html/
```

## 8. Configure Nginx

Nginx serves the frontend and reverse-proxies API requests to Express.

Edit the default site:

``` bash
sudo nano /etc/nginx/sites-available/default
```

The intended configuration:

``` nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name code-mate.in www.code-mate.in 3.26.50.89;

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

The trailing slash in `proxy_pass http://localhost:3000/;` strips the
`/api/` prefix when forwarding. This is appropriate when Express routes
are defined without the `/api` prefix. If backend route mounting
differs, align the Nginx and frontend paths.

Test the configuration:

``` bash
sudo nginx -t
```

If successful, reload Nginx and check its status:

``` bash
sudo systemctl reload nginx
sudo systemctl status nginx
```

The site was reachable over HTTP at `http://3.26.50.89` during testing.

## 9. Configure Cloudflare DNS

The domain `code-mate.in` was added to Cloudflare. The DNS records were:

  Name             Type    Content          Proxy status
  ---------------- ------- ---------------- --------------
  `code-mate.in`   A       `3.26.50.89`     Proxied
  `www`            CNAME   `code-mate.in`   Proxied

The records were initially DNS only and later changed to **Proxied**
(orange cloud). With proxy enabled, DNS lookups can return Cloudflare IP
addresses instead of the EC2 address; that is expected.

## 10. Enable HTTPS with Certbot

Certbot was run on the Ubuntu EC2 instance to request and install a
Let's Encrypt certificate for both hostnames:

``` bash
sudo certbot --nginx -d code-mate.in -d www.code-mate.in
```

The email address was entered, the Terms of Service were accepted, and
Certbot successfully issued and deployed the certificate in Nginx.

Certificate files:

``` text
/etc/letsencrypt/live/code-mate.in/fullchain.pem
/etc/letsencrypt/live/code-mate.in/privkey.pem
```

Certbot configured automatic renewal. The certificate issued during
setup showed an expiry date of `2026-12-31`.

Check certificates and test renewal:

``` bash
sudo certbot certificates
sudo certbot renew --dry-run
```

## 11. Configure Cloudflare SSL/TLS

In the Cloudflare dashboard:

1.  Select `code-mate.in`.
2.  Open **SSL/TLS → Overview**.
3.  Set the encryption mode to **Full (strict)**.

Full (strict) encrypts traffic between visitors and Cloudflare, and
between Cloudflare and the EC2 origin. The origin has a valid Let's
Encrypt certificate.

## 12. Verification completed

-   EC2 was accessible through SSH.
-   Nginx was running.
-   The backend was running under PM2.
-   Backend logs showed MongoDB connected and the server listening on
    port `3000`.
-   `http://3.26.50.89` returned `HTTP/1.1 200 OK`.
-   `http://code-mate.in` returned `HTTP/1.1 200 OK` before HTTPS setup.
-   Certbot successfully issued and deployed a certificate for both
    domain names.
-   `https://code-mate.in` and `https://www.code-mate.in` both opened
    successfully.
-   The login page and main application interface were accessible.

## 13. Deploy future changes

After pushing code to the branch used for deployment, connect to EC2 and
pull that branch. Example for `main` (change it if you deploy from
another branch):

``` bash
cd ~/CODEMATE
git pull origin main
```

If frontend files changed, rebuild and copy them:

``` bash
cd ~/CODEMATE/frontend
npm install
npm run build
sudo cp -r dist/. /var/www/html/
```

If backend files or dependencies changed, install dependencies and
restart PM2:

``` bash
cd ~/CODEMATE/backend
npm install
pm2 restart codemate-backend
```

If both parts changed, perform both sets of steps. Check the website and
backend logs afterward.

## 14. Current status

  Component                   Status
  --------------------------- -----------------------------------
  AWS EC2 Ubuntu              Set up
  SSH access                  Working
  Node.js via NVM             Installed
  Git repository              Cloned
  Backend                     Running with PM2
  MongoDB Atlas               Connection verified in logs
  Frontend build              Deployed to Nginx web root
  Nginx                       Serving frontend and proxying API
  Cloudflare DNS              Configured and proxied
  Let's Encrypt certificate   Issued and deployed
  HTTPS on apex and `www`     Working
  Port 3000                   Intentionally left open

## 15. Troubleshooting commands

``` bash
# Test Nginx configuration
sudo nginx -t

# Nginx service status
sudo systemctl status nginx

# Recent Nginx errors
sudo tail -n 50 /var/log/nginx/error.log

# PM2 status and backend logs
pm2 status
pm2 logs codemate-backend

# Check backend locally on EC2
curl -I http://localhost:3000

# Check Nginx locally on EC2
curl -I http://localhost

# Check certificates
sudo certbot certificates
```

If Nginx configuration is changed, run `sudo nginx -t` before reloading
it. If the backend fails, inspect `pm2 logs codemate-backend`.

------------------------------------------------------------------------

**Note:** This README records the deployment work and successful checks
completed so far. Never store PEM keys, passwords, JWT secrets, or
MongoDB credentials in this file or in Git.
