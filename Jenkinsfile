pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-id')
        GITHUB_CREDENTIALS = credentials('github-token-id')
        BACKEND_IMAGE = "laaouafifatiha/todo-backend"
        FRONTEND_IMAGE = "laaouafifatiha/todo-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', credentialsId: 'github-token-id', url: 'https://github.com/LAAOUAFIFATIHA/react-flask-MongoDb-Todo-DevSecOPS-'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'docker-compose up -d'
                sh 'docker ps'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh """
                echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                docker tag backend:latest $BACKEND_IMAGE:latest
                docker tag frontend:latest $FRONTEND_IMAGE:latest
                docker push $BACKEND_IMAGE:latest
                docker push $FRONTEND_IMAGE:latest
                """
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker-compose down'
            }
        }
    }

    post {
        always {
            sh 'docker system prune -f'
        }
    }
}
