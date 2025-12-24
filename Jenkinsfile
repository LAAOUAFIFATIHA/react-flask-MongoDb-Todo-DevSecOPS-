pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
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
        stage('Test Locally') {
            steps {
                sh 'docker-compose up -d'
                sh 'sleep 10'
                sh 'docker ps'
            }
        }
        stage('Login Docker Hub') {
            steps {
                sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"
            }
        }
        stage('Push to Docker Hub') {
            steps {
                sh 'docker-compose push'
            }
        }
    }
    post {
        always {
            sh 'docker-compose down'
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check console output.'
        }
    }
}
