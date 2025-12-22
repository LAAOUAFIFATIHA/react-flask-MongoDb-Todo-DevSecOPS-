pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // Jenkins stored creds
        GITHUB_TOKEN = credentials('github-token') // Optional if repo is private
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/LAAOUAFIFATIHA/react-flask-MongoDb-Todo-DevSecOPS-.git'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh 'docker-compose build'
                }
            }
        }

        stage('Test Locally') {
            steps {
                script {
                    sh 'docker-compose up -d'
                    sh 'sleep 10' // Wait for containers to start
                    sh 'docker ps' // Simple check
                    // Optional: Add curl commands to test endpoints
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"
                    sh 'docker-compose push'
                }
            }
        }
    }

    post {
        always {
            script {
                sh 'docker-compose down'
            }
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check console output.'
        }
    }
}
