pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        BACKEND_IMAGE = "laaouafifatiha/todo-backend"
        FRONTEND_IMAGE = "laaouafifatiha/todo-frontend"
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/LAAOUAFIFATIHA/react-flask-MongoDb-Todo-DevSecOPS-.git'
            }
        }
        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }
        stage('Push to Docker Hub') {
            steps {
                sh """
                echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                docker tag todo-list_backend:latest $BACKEND_IMAGE:latest
                docker tag todo-list_frontend:latest $FRONTEND_IMAGE:latest
                docker push $BACKEND_IMAGE:latest
                docker push $FRONTEND_IMAGE:latest
                """
            }
        }
    }
}
