pipeline {
    agent none
    options {
        disableConcurrentBuilds(abortPrevious: true)
        skipStagesAfterUnstable()
        timestamps()
    }
    environment {
        ECR_REPO = '565654345845.dkr.ecr.ap-southeast-1.amazonaws.com'
        DOCKER_IMAGE_NAME = 'origin-web-campaign'
    }
    stages {
        stage('Clone repository') {
          agent {label 'arm-slave'}
          when { anyOf { branch 'main'; branch 'staging' } }
          steps {
            script{
              notifyDiscord('STARTED')
              checkout scm
            }
          }
        }

        stage('Set Parameters') {
            agent { label 'arm-slave'}
            when { anyOf { branch 'main'; branch 'staging' } }
            steps {
                script {
                    def branchParams = setBranchParameters()
                    DOCKER_IMAGE = branchParams.DOCKER_IMAGE
                    APP_STAGE = branchParams.APP_STAGE
                    echo "DOCKER_IMAGE: ${DOCKER_IMAGE}"
                    echo "APP_STAGE: ${APP_STAGE}"
                }
            }
        }

        stage('Build') {
            agent {label 'arm-slave'}
            when { anyOf { branch 'main'; branch 'staging' } }
            steps {
                script {
                    app = docker.build(DOCKER_IMAGE + "1")
                }
            }
        }


        stage('PushImage') {
            agent {label 'arm-slave'}
            when { anyOf { branch 'main'; branch 'staging' } }
            steps {
                script {
                    docker.withRegistry('https://565654345845.dkr.ecr.ap-southeast-1.amazonaws.com', 'ecr:ap-southeast-1:ecr-aws') {
                        app.push("${env.BUILD_NUMBER}")
                    }
                }
            }
        }

        stage('Deploy') {
            agent {label 'arm-slave'}
            when { anyOf { branch 'main'; branch 'staging' } }
            steps {
                script {
                    updateDeploymentFile(APP_STAGE, DOCKER_IMAGE)
                    pushToGithub()
                }
            }
        }
    }
    post {
        always {
            script {
                notifyDiscord(currentBuild.currentResult)
            }
        }
    }
}

def updateDeploymentFile(String appStage, String dockerImage) {
    git branch: 'main',
        credentialsId: 'github-un',
        url: 'https://github.com/origin-property/config.git'

    def yamlFile = readYaml(file: "./origin-web-campaign/${appStage}/Deployment.yaml")
    yamlFile.spec.template.spec.containers[0].image = dockerImage + env.BUILD_NUMBER
    sh("rm -f ./origin-web-campaign/${appStage}/Deployment.yaml")
    writeYaml file: "./origin-web-campaign/${appStage}/Deployment.yaml", data: yamlFile
}

def pushToGithub() {
    withCredentials([usernamePassword(credentialsId: 'github-un', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
        def buildNumber = env.BUILD_NUMBER
        
        sh """
            git config --global user.email "jenkins@myorigin.net"
            git config --global user.name "Jenkins"
            git add .
            git commit -am "bump to version ${buildNumber}"
            git push https://\${USERNAME}:\${PASSWORD}@github.com/origin-property/config.git HEAD:main
        """
    }
}

def setBranchParameters() {
    def params = [:]
    if (env.BRANCH_NAME == 'main') {
        params.DOCKER_IMAGE = env.ECR_REPO + '/' + env.DOCKER_IMAGE_NAME + ':'
        params.APP_STAGE = 'production'
    } else if (env.BRANCH_NAME == 'staging') {
        params.DOCKER_IMAGE = env.ECR_REPO + '/' + env.DOCKER_IMAGE_NAME + ':'
        params.APP_STAGE = 'staging'
    }
    return params
}


def notifyDiscord(String status) {
    def timeStamp = new Date().format('yyyy/MM/dd HH:mm')
    def statusEmoji = [
        'SUCCESS': ':white_check_mark:',
        'FAILURE': ':x:',
        'ABORTED': ':warning:',
        'UNSTABLE': ':yellow_circle:'
    ]
    def emoji = statusEmoji[status] ?: ':question:'
    
    def statusText = [
        'SUCCESS': 'succeeded',
        'FAILURE': 'failed',
        'ABORTED': 'aborted',
        'UNSTABLE': 'unstable'
    ]
    def text = statusText[status] ?: 'completed'
    
    def message = """${emoji} **Build ${text}!**
:package: Build: #${env.BUILD_NUMBER}
:twisted_rightwards_arrows: Branch: ${env.BRANCH_NAME}
:stopwatch: Duration: ${currentBuild.durationString}
:link: URL: ${env.BUILD_URL}"""
    
    try {
        discordSend description: message, footer: timeStamp, link: env.BUILD_URL, result: status, title: env.JOB_NAME, webhookURL: env.DISCORD_WEBHOOKURL
    } catch (Exception e) {
        echo "Failed to send Discord notification: ${e.getMessage()}"
    }
}
