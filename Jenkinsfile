pipeline {
  agent any
  stages {
    stage('Start') {
      steps {
        checkout scm
        sh '''
          ls
          cat docker-compose.yaml
        '''
      }
    }
  }
}