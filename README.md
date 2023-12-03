# HyperledgerFabric_SSI
#### ⚪ About Project
* ##### 디지털 환경에서 개인신원 관리에 대한 기존방식의 대책을 제시
* ##### 하이퍼레저 페브릭만의 특성을 활용해 개인 정보 보호, 안정성을 강화 및 DID 기술을 적용한 사용자 신원 관리 방법 개발
* ##### 하이퍼레저 페브릭 기술, DID 핵심 기능 구현을 통한 SSI 모델 기반 3세대 디지털 자기주권 신원인증 플랫폼을 개발

- - -

#### ⚪ Running Screen || Video
<p align ="center">
  <a href="https://www.youtube.com/watch?v=-RhS38dKmUY"><img src ="https://img.shields.io/badge/youtube-FF0000.svg?&style=for-the-badge&logo=youtube&logoColor=white"/></a>
  </br>
  <img src="https://github.com/MpqM/HyperledgerFabric_SSI/assets/79093184/56bd1b8d-6dfc-468b-ae47-3d61733919ca">
</p>

- - -

#### ⚪ Built With
<p align ="center">
  <img alt="React" src ="https://img.shields.io/badge/react-61DAFB.svg?&style=for-the-badge&logo=React&logoColor=white"/> <img alt="typescript" src ="https://img.shields.io/badge/typescript-3178C6.svg?&style=for-the-badge&logo=typescript&logoColor=white"/> <img alt="express" src ="https://img.shields.io/badge/express-339933.svg?&style=for-the-badge&logo=express&logoColor=white"/> <img alt="nodedotjs" src ="https://img.shields.io/badge/nodejs-339933.svg?&style=for-the-badge&logo=nodedotjs&logoColor=white"/> <img alt="mongodb" src ="https://img.shields.io/badge/mongodb-339933.svg?&style=for-the-badge&logo=mongodb&logoColor=white"/> <img alt="typescript" src ="https://img.shields.io/badge/hyperledger-3178C6.svg?&style=for-the-badge&logo=hyperledger&logoColor=white"/>
</p>

- - -

#### ⚪ Getting Started
```bash
# Prerequisites: npm, node, MongoDB Connection URL, ubuntu 20, docker, fabric-bin
# ~
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install git -y
sudo apt-get install curl -y
# build-essential
sudo apt update
sudo apt install build-essential
#vscode 설치하기
go, docker extension 설치
# docker
sudo apt-get install docker-compose -y
docker --version
docker-compose --version
sudo systemctl start docker
sudo systemctl enable docker
# node.js
# https://github.com/nodesource
# nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
nvm -v
sudo reboot
# node.js, npm
nvm install l6
node -v
npm -v
# go
sudo apt remove 'golang-*'
wget https://go.dev/dl/go1.20.5.linux-amd64.tar.gz
tar xf go1.20.5.linux-amd64.tar.gz
sudo mv go /usr/local/go
gedit .profile
# 끝에서 아래 세줄 추가 후 ctrl x로 저장
export GOROOT=/usr/local/go
export GOPATH=$HOME/.go
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin:$GOPATH/src/fabir-samples/bin
source .profile
go version
# jq
sudo apt-get install jq -y
# fabric-samples
# bin 폴더안에 fabric-samples 바이너리 파일 삽입
echo $HOME
mkdir -p $HOME/.go/src
cd $HOME/.go/src/
curl -sSL https://bit.ly/2ysbOFE | bash -s
docker pull hyperledger/fabric-couchdb:latest
# 컨트랙트에서 go.mod, go.sum 자동생성하기
cd {chaincode/path}
go mod init
go mod tidy
GO111MODULE=on go mod vendor
```
```bash
# execution
git clone https://github.com/MpqM/HyperledgerFabric_SSI.git
# hyperledgerfabric
# Change docker-compose, script Msp or address with yours
cd hyperledgerfabric
sudo su
./network.sh start
# backend
cd server
# Change the MONGO_CONNECTION_STRING value in the server/.env file with yours
# Change Hyperledgerfabric Component MSP path value in the server/.env file with yours
npm install
npm start
# frontend
cd client
npm install
npm start
```

- - -

#### ⚪ Description
<p align ="center">
https://drive.google.com/file/d/1kzSjT_GSrpw0JnYox_81vDI9QGD6dBXg/view?usp=sharing
</p>

- - -

#### ⚪ Writer
<p align ="center">
  <img src ="https://img.shields.io/badge/gmail-EA4335.svg?&style=for-the-badge&logo=gmail&logoColor=white"/></a> <a href = "https://github.com/MpqM"><img src ="https://img.shields.io/badge/GitHub-181717.svg?&style=for-the-badge&logo=GitHub&logoColor=white"/></a> <a href = "https://MpqM.tistory.com/"> <img src ="https://img.shields.io/badge/tistory-000000.svg?&style=for-the-badge&logo=Tistory&logoColor=white"/></a>
</p>

- - -
