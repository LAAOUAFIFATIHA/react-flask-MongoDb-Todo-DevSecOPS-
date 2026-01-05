pipeline {
    agent any
    environment {
        // Credentials ID must match what is configured in Jenkins
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-id') 
    }
    stages {
        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }
        
        stage('Backup Current Version') {
            steps {
                script {
                    echo 'Creating backup of current stable version...'
                    // We try to pull the current 'latest' to tag it as backup. 
                    // Use || true so it doesn't fail on the first run when no image exists.
                    sh 'docker pull laaouafifatiha/todo-backend-enhanced:latest || true'
                    sh 'docker tag laaouafifatiha/todo-backend-enhanced:latest laaouafifatiha/todo-backend-enhanced:backup || true'
                    
                    sh 'docker pull laaouafifatiha/todo-frontend-enhanced:latest || true'
                    sh 'docker tag laaouafifatiha/todo-frontend-enhanced:latest laaouafifatiha/todo-frontend-enhanced:backup || true'
                }
            }
        }

        stage('Build New Version') {
            steps {
                script {
                    echo 'Building new version...'
                    sh 'docker-compose build'
                    
                    // Tag with build number
                    sh "docker tag laaouafifatiha/todo-backend-enhanced:latest laaouafifatiha/todo-backend-enhanced:${BUILD_NUMBER}"
                    sh "docker tag laaouafifatiha/todo-frontend-enhanced:latest laaouafifatiha/todo-frontend-enhanced:${BUILD_NUMBER}"
                }
            }
        }

        stage('Test New Version (With Rollback)') {
            steps {
                script {
                    try {
                        echo '🚀 Deploying new version for testing...'
                        sh 'docker-compose up -d --remove-orphans'
                        
                        echo '⏳ Waiting 30s for services to stabilize...'
                        sleep 30 
                        
                        echo 'Running System Health Checks...'
                        
                        // Check if containers are running
                        sh "docker ps -q -f name=task_api_container | grep ."
                        sh "docker ps -q -f name=task_web_container | grep ."
                        
                        echo 'Testing Backend API...'
                        // Retry loop for API health
                        sh '''
                        for i in {1..5}; do
                            if docker exec task_api_container curl -f -s http://localhost:5000/health; then
                                echo "✅ Backend is healthy."
                                exit 0
                            fi
                            echo "Waiting for API... ($i/5)"
                            sleep 5
                        done
                        echo "❌ Backend health check FAILED."
                        exit 1
                        '''
                        
                        echo 'Testing Frontend Access...'
                        // Since we are using npx serve on 3000, we check localhost:3000
                        sh 'curl -f -s http://localhost:3000 > /dev/null'
                        echo '✅ Frontend is accessible.'

                    } catch (Exception e) {
                        echo '🔴 DEPLOYMENT FAILED! INITIATING AUTOMATIC ROLLBACK...'
                        echo "Error: ${e.message}"
                        
                        sh 'docker-compose down'
                        
                        echo 'Restoring previous stable images...'
                        sh 'docker tag laaouafifatiha/todo-backend-enhanced:backup laaouafifatiha/todo-backend-enhanced:latest'
                        sh 'docker tag laaouafifatiha/todo-frontend-enhanced:backup laaouafifatiha/todo-frontend-enhanced:latest'
                        
                        echo 'Restarting previous stable version...'
                        sh 'docker-compose up -d'
                        
                        echo 'Verifying rollback status...'
                        sleep 30
                        sh 'docker exec task_api_container curl -f -s http://localhost:5000/health'
                        
                        error "Deployment failed and was automatically rolled back."
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo 'Pushing verified images to Docker Hub...'
                    withDockerRegistry(credentialsId: 'dockerhub-id', toolName: 'docker') {
                        sh "docker push laaouafifatiha/todo-backend-enhanced:${BUILD_NUMBER}"
                        sh "docker push laaouafifatiha/todo-frontend-enhanced:${BUILD_NUMBER}"
                        sh "docker push laaouafifatiha/todo-backend-enhanced:latest"
                        sh "docker push laaouafifatiha/todo-frontend-enhanced:latest"
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo '==================================================='
            echo 'Pipeline execution finished.'
            echo '==================================================='
        }
        failure {
            echo '🚨 DEPLOYMENT FAILED'
            echo '🔄 System checks or tests failed.'
        }
        success {
            echo '✅ DEPLOYMENT SUCCESSFUL'
            echo '🚀 New version is live and backed up.'
        }
    }
}
