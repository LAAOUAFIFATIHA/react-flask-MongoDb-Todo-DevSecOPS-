# Full-Stack To-Do List Application (DevSecOps Oriented)

![GitHub Repo Size](https://img.shields.io/github/repo-size/LAAOUAFIFATIHA/react-flask-MongoDb-Todo-DevSecOPS)
![GitHub Stars](https://img.shields.io/github/stars/LAAOUAFIFATIHA/react-flask-MongoDb-Todo-DevSecOPS?style=social)
![GitHub Forks](https://img.shields.io/github/forks/LAAOUAFIFATIHA/react-flask-MongoDb-Todo-DevSecOPS?style=social)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-red)
![Security](https://img.shields.io/badge/Security-JWT%20Auth-green)

---

## 📌 Project Overview

This project is a **Full-Stack To-Do List Application** designed and implemented following **DevSecOps best practices**.  
It demonstrates how to build, secure, automate, and deploy a modern web application using industry-standard tools.

The application allows users to:
- Create, read, update, and delete tasks
- Authenticate securely using JWT
- Interact with a RESTful backend
- Be deployed and tested automatically via CI/CD pipelines

---

## 🛠️ Tech Stack

### 🎨 Frontend
- ⚛️ React.js
- 🌐 Axios
- 🎨 HTML5 / CSS3 / JavaScript

### 🔧 Backend
- 🐍 Flask (Python)
- 🔐 JWT Authentication
- 🌍 RESTful APIs

### 🗄️ Database
- 🍃 MongoDB

### 🚀 DevOps / DevSecOps
- 🐳 Docker
- 🧪 Automated Testing
- 🔄 Jenkins Pipeline
- 🔐 Secure credentials management

---

## 🔐 Security Features

- JWT-based authentication
- Secure API endpoints
- Environment-based secrets handling
- DevSecOps mindset integrated into CI/CD

---

## ⚙️ CI/CD Pipeline (Jenkins)

The Jenkins pipeline automates:
1. Source code checkout from GitHub
2. Dependency installation
3. Application build
4. Docker image creation
5. (Optional) Push image to Docker Hub
6. Automated testing

---

## 📂 Project Structure

react-flask-mongodb-todo-devsecops/
│
├── frontend/ # React application
├── backend/ # Flask API
├── Jenkinsfile # CI/CD pipeline
├── Dockerfile # Containerization
├── docker-compose.yml
└── README.md


---

## ▶️ How to Run Locally

### 1️⃣ Clone the repository
```bash
git clone https://github.com/LAAOUAFIFATIHA/react-flask-MongoDb-Todo-DevSecOPS.git
cd react-flask-MongoDb-Todo-DevSecOPS
docker-compose up --build


