pipeline {
  agent any
  stages {
    stage('Start') {
      steps {
        sh '''
          docker version
          docker compose version
          cd /
          ls /home
        '''
      }
    }
  }
}