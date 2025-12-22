pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // must match Jenkins credentials ID
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

        stage('Push to Docker Hub') {
            steps {
                sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"
                sh 'docker-compose push'
            }
        }
    }

    post {
        always {
            steps {                   // ✅ steps block is required
                sh 'docker-compose down'
            }
        }
        success {
            steps {
                echo 'Pipeline completed successfully!'
            }
        }
        failure {
            steps {
                echo 'Pipeline failed. Check console output.'
            }
        }
    }
}
