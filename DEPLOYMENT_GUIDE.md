# 🚀 Deployment Guide: Bookstore Full-Stack App on AWS EC2 & PaaS

This guide covers the architectural classification of AWS EC2 vs. PaaS, step-by-step deployment on AWS EC2 using Docker Compose and GitHub Actions CI/CD, and how your multi-container architecture eliminates the need for separate managed database storage.

---

## 1. 💡 Architectural Clarification: Is AWS EC2 a PaaS?

| Cloud Model | Examples | Description | Who Manages What |
| :--- | :--- | :--- | :--- |
| **IaaS** *(Infrastructure as a Service)* | **AWS EC2**, Google Compute Engine, Azure VMs | Raw virtual compute instances, OS, disks, and networking. | **You manage:** OS updates, security patches, Docker daemon, container orchestration, and storage.<br>**AWS manages:** Physical servers, data center power, and virtualization hypervisors. |
| **PaaS** *(Platform as a Service)* | **AWS Elastic Beanstalk**, **AWS App Runner**, Render, Railway, Heroku | Managed platform environment for deploying apps without managing servers. | **You manage:** Application code and Docker images.<br>**AWS manages:** OS, scaling, load balancing, health checks, and server runtime. |

### Why Deploying Multi-Container Docker on EC2 is Ideal Here:
1. **Zero Extra Database Costs**: AWS RDS (Managed MySQL) costs $15–$30+/month. By dockerizing MySQL alongside Next.js and Spring Boot on EC2, you run the database inside a Docker container with local volume persistence (`bookstore_mysql_data`) on the EC2 instance's EBS drive at **no extra database cost**.
2. **Complete Architectural Control**: You define exact port mappings, JVM memory flags, and container restart policies inside `docker-compose.yml`.
3. **Automated CI/CD**: With the included GitHub Actions workflow, pushing to GitHub triggers an automated SSH deployment to EC2, giving you a seamless **PaaS-like developer experience on IaaS infrastructure**.

---

## 2. 📋 Step-by-Step Deployment on AWS EC2 via GitHub Actions

### Step 2.1: Launch an AWS EC2 Instance
1. Log in to the [AWS Management Console](https://aws.amazon.com/console/) and navigate to **EC2**.
2. Click **Launch Instance**:
   - **Name**: `bookstore-fullstack-server`
   - **AMI**: Ubuntu Server 22.04 LTS or 24.04 LTS (64-bit x86)
   - **Instance Type**: `t3.small` (2 vCPU, 2GB RAM recommended for compiling Java & Next.js; `t2.micro` works if swap memory is enabled).
   - **Key Pair**: Create new or select an existing `.pem` key pair (e.g., `bookstore-key.pem`). Save this file on your local machine.
   - **Storage**: Change the root volume to at least **20 GB gp3** (to allow sufficient space for Docker images and Maven build cache).

### Step 2.2: Configure EC2 Inbound Security Group Rules
In the **Network settings** / **Security Group** section, ensure the following inbound ports are open:

| Type | Port Range | Source | Description |
| :--- | :--- | :--- | :--- |
| **SSH** | `22` | `0.0.0.0/0` (or your IP) | For SSH access & GitHub Actions CI/CD |
| **Custom TCP** | `3000` | `0.0.0.0/0` | Next.js Frontend Web UI |
| **Custom TCP** | `8080` | `0.0.0.0/0` | Spring Boot REST API |
| **HTTP** | `80` | `0.0.0.0/0` | Optional Nginx reverse proxy / Web traffic |

---

### Step 2.3: Initial EC2 Setup (Install Docker & Docker Compose)
Connect to your EC2 instance via SSH terminal:
```bash
ssh -i "bookstore-key.pem" ubuntu@<YOUR-EC2-PUBLIC-IP>
```

Run the following command script to install Docker and Docker Compose v2:
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y ca-certificates curl gnupg lsb-release
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin git

# Allow ubuntu user to execute docker commands without sudo
sudo usermod -aG docker ubuntu
newgrp docker

# Optional: Add 2GB Swap Memory (Recommended if using t2.micro / t3.micro)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify docker installation
docker --version
docker compose version
```

---

### Step 2.4: Configure GitHub Repository Secrets
In your GitHub repository, navigate to **Settings** > **Secrets and variables** > **Actions** > **New repository secret**, and create:

1. `EC2_HOST`: The Public IPv4 address or Public DNS of your EC2 instance (e.g., `54.210.120.45`).
2. `EC2_USERNAME`: `ubuntu`
3. `EC2_SSH_KEY`: The entire content of your `bookstore-key.pem` private key file:
   ```text
   -----BEGIN RSA PRIVATE KEY-----
   MIIEowIBAAKCAQEA...
   ...
   -----END RSA PRIVATE KEY-----
   ```
4. `DB_USER` (Optional): `bookstore_user`
5. `DB_PASSWORD` (Optional): `bookstore_secure_pass`
6. `DB_ROOT_PASSWORD` (Optional): `root_super_secure_pass`

---

### Step 2.5: Push to GitHub & Trigger Automated Deployment
Initialize Git and push your repository to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Full-stack bookstore with Docker and CI/CD"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```

**What happens automatically:**
1. GitHub Actions detects the push to `main` and runs `.github/workflows/deploy.yml`.
2. Job 1 verifies the Spring Boot code compiles with Maven.
3. Job 2 SSHs into the EC2 instance, checks out the repo to `~/bookstore-app`, writes the `.env` file with the EC2 Public IP, and runs `docker compose up -d --build`.
4. MySQL initializes its database and mounts persistent data into `bookstore_mysql_data`.
5. Spring Boot waits for MySQL's healthcheck, auto-creates tables, and seeds initial books.
6. Next.js starts on port 3000, communicating seamlessly with Spring Boot on port 8080.

---

### Step 2.6: Accessing Your Live Application
- **Next.js Storefront UI**: `http://<EC2-PUBLIC-IP>:3000`
- **Spring Boot REST API**: `http://<EC2-PUBLIC-IP>:8080/api/books`
- **Backend Health Check**: `http://<EC2-PUBLIC-IP>:8080/api/health`

---

## 3. 🌐 Alternative: Deploying to AWS Elastic Beanstalk (AWS Native PaaS)

If your organization strictly requires using a managed **AWS PaaS**:
1. In the AWS Console, search for **Elastic Beanstalk**.
2. Click **Create Application**:
   - Platform: **Docker** (Multi-container Docker / Docker on Amazon Linux 2023).
   - Upload your `docker-compose.yml` file directly.
3. Set Environment Properties:
   - `DB_NAME=bookstore_db`
   - `DB_USER=bookstore_user`
   - `DB_PASSWORD=bookstore_pass`
4. Click **Deploy**. AWS Elastic Beanstalk automatically provisions the EC2 instance, sets up the load balancer, mounts the Docker containers, and handles SSL certificates.
