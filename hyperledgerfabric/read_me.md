function -> upper
variable -> lowerupper
chaincode -> pascal+camel
application -> camel

network:
    ordererorg.com:7050:
        orderer0.ordererorg.com:7051 [operation_listenaddress 7071(T)] [ID/PW: orderer0.ordererorg.com / ''_pw]
        orderer1.ordererorg.com:7052 [operation_listenaddress 7072][ID/PW: orderer1.ordererorg.com / ''_pw]
        orderer2.ordererorg.com:7053 [operation_listenaddress 7073][ID/PW: orderer2.ordererorg.com / ''_pw]
        ca.ordererorg.com:7060 [CA_SERVER]
        users_admin [ID/PW: orderera.ordererorg0.com / ''_pw]

    org1.com:8050:
        chaincode 8070
        peer0.org1.com:8051 [couchdb:5984(T)][ID/PW: peer0.org1.com / ''_pw][anchorpeer][chaincode_listennaddress 8071]
        peer1.org1.com:8052 [couchdb:6984][ID/PW: peer1.org1.com / ''_pw][chaincode_listennaddress 8072]
        ca.org1.com:8060 [CA_SERVER]
        users_admin [ID/PW: peera.org1.com / ''_pw]
        users_user1 [ID/PW: peeru.org1.com / ''_pw]
        
    org2.com:9050:
        chaincode 9070
        peer0.org2.com:9051 [couchdb:7984][ID/PW: peer0.org2.com / ''_pw][anchorpeer] [chaincode_listennaddress 9071]
        peer1.org2.com:9052 [couchdb:8984][ID/PW: peer1.org2.com / ''_pw][chaincode_listennaddress 9072]
        ca.org2.com:9060 [CA_SERVER]
        users_admin [ID/PW: peera.org2.com / ''_pw]
        users_user1 [ID/PW: peeru.org2.com / ''_pw]

    org3.com:10050:
        chaincode 10070
        peer0.org3.com:10050 [couchdb:9984][ID/PW: peer0.org3.com / ''_pw][anchorpeer] [chaincode_listennaddress 10071]
        peer1.org3.com:10050 [couchdb:10984][ID/PW: peer1.org3.com / ''_pw][chaincode_listennaddress 10072]
        ca.org3.com:10060 [CA_SERVER]
        users_admin [ID/PW: peera.org3.com / ''_pw]
        users_user1 [ID/PW: peeru.org3.com / ''_pw]
    cert:
        │   ├── ordererOrganizations
        │   └── ordererorg.com
        │       ├── fabric-ca-client-config.yaml
        │       ├── msp
        │       │   ├── cacerts
        │       │   │   └── localhost-7060-ca-ordererorg-com.pem
        │       │   ├── config.yaml
        │       │   ├── IssuerPublicKey
        │       │   ├── IssuerRevocationPublicKey
        │       │   ├── keystore
        │       │   │   └── ad263d981f3a53df7b27a4dffe5093004910e076705395d706650b4dda974844_sk
        │       │   ├── signcerts
        │       │   │   └── cert.pem
        │       │   ├── tlscacerts
        │       │   │   └── tlsca.ordererorg.com-cert.pem
        │       │   └── user
        │       ├── orderers
        │       │   ├── orderer0.ordererorg.com
        │       │   │   ├── msp
        │       │   │   │   ├── cacerts
        │       │   │   │   │   └── localhost-7060-ca-ordererorg-com.pem
        │       │   │   │   ├── config.yaml
        │       │   │   │   ├── IssuerPublicKey
        │       │   │   │   ├── IssuerRevocationPublicKey
        │       │   │   │   ├── keystore
        │       │   │   │   │   └── 2924a64f9c62c05097fd1c698ddae725a52db879a48fff6efb711a62eced2867_sk
        │       │   │   │   ├── signcerts
        │       │   │   │   │   └── cert.pem
        │       │   │   │   ├── tlscacerts
        │       │   │   │   │   └── tlsca.ordererorg.com-cert.pem
        │       │   │   │   └── user
        │       │   │   └── tls
        │       │   │       ├── cacerts
        │       │   │       ├── ca.crt
        │       │   │       ├── IssuerPublicKey
        │       │   │       ├── IssuerRevocationPublicKey
        │       │   │       ├── keystore
        │       │   │       │   └── 576a2f527d6d4d1040ee945be527ab223fbc15c93066a1485ef5d560de2a7b76_sk
        │       │   │       ├── server.crt
        │       │   │       ├── server.key
        │       │   │       ├── signcerts
        │       │   │       │   └── cert.pem
        │       │   │       ├── tlscacerts
        │       │   │       │   └── tls-localhost-7060-ca-ordererorg-com.pem
        │       │   │       └── user
        │       │   ├── orderer1.ordererorg.com
        │       │   │   ├── msp
        │       │   │   │   ├── cacerts
        │       │   │   │   │   └── localhost-7060-ca-ordererorg-com.pem
        │       │   │   │   ├── config.yaml
        │       │   │   │   ├── IssuerPublicKey
        │       │   │   │   ├── IssuerRevocationPublicKey
        │       │   │   │   ├── keystore
        │       │   │   │   │   └── 142d05828d347a8144892165257a50aa22edbb26100450d817c05a0937bc8fdc_sk
        │       │   │   │   ├── signcerts
        │       │   │   │   │   └── cert.pem
        │       │   │   │   ├── tlscacerts
        │       │   │   │   │   └── tlsca.ordererorg.com-cert.pem
        │       │   │   │   └── user
        │       │   │   └── tls
        │       │   │       ├── cacerts
        │       │   │       ├── ca.crt
        │       │   │       ├── IssuerPublicKey
        │       │   │       ├── IssuerRevocationPublicKey
        │       │   │       ├── keystore
        │       │   │       │   └── 3c9ec6f4ed64249760b717d073d638985f11b577363cc1a6da9df0cb06330f04_sk
        │       │   │       ├── server.crt
        │       │   │       ├── server.key
        │       │   │       ├── signcerts
        │       │   │       │   └── cert.pem
        │       │   │       ├── tlscacerts
        │       │   │       │   └── tls-localhost-7060-ca-ordererorg-com.pem
        │       │   │       └── user
        │       │   └── orderer2.ordererorg.com
        │       │       ├── msp
        │       │       │   ├── cacerts
        │       │       │   │   └── localhost-7060-ca-ordererorg-com.pem
        │       │       │   ├── config.yaml
        │       │       │   ├── IssuerPublicKey
        │       │       │   ├── IssuerRevocationPublicKey
        │       │       │   ├── keystore
        │       │       │   │   └── 022c53258d417b10dd24a8601e4d524a14e75ddbde2475acc72665a72e1d1af3_sk
        │       │       │   ├── signcerts
        │       │       │   │   └── cert.pem
        │       │       │   ├── tlscacerts
        │       │       │   │   └── tlsca.ordererorg.com-cert.pem
        │       │       │   └── user
        │       │       └── tls
        │       │           ├── cacerts
        │       │           ├── ca.crt
        │       │           ├── IssuerPublicKey
        │       │           ├── IssuerRevocationPublicKey
        │       │           ├── keystore
        │       │           │   └── 84ef8b6098938bfb73ced430fae9ec84d23722d9e6e256d1897a8b326585878a_sk
        │       │           ├── server.crt
        │       │           ├── server.key
        │       │           ├── signcerts
        │       │           │   └── cert.pem
        │       │           ├── tlscacerts
        │       │           │   └── tls-localhost-7060-ca-ordererorg-com.pem
        │       │           └── user
        │       └── users
        │           └── Admin@ordererorg.com
        │               └── msp
        │                   ├── cacerts
        │                   │   └── localhost-7060-ca-ordererorg-com.pem
        │                   ├── config.yaml
        │                   ├── IssuerPublicKey
        │                   ├── IssuerRevocationPublicKey
        │                   ├── keystore
        │                   │   └── 44a54100eb44b624780ed5667ce6e709f6aa787fb6083cee090cae4f82ca754d_sk
        │                   ├── signcerts
        │                   │   └── cert.pem
        │                   └── user
        └── peerOrganizations
            ├── org1.com
            │   ├── ca
            │   │   └── ca.org1.com-cert.pem
            │   ├── fabric-ca-client-config.yaml
            │   ├── msp
            │   │   ├── cacerts
            │   │   │   └── localhost-8060-ca-org1-com.pem
            │   │   ├── config.yaml
            │   │   ├── IssuerPublicKey
            │   │   ├── IssuerRevocationPublicKey
            │   │   ├── keystore
            │   │   │   └── 00cb488e9a8b0f8ceb8bff59ee6216ccf60cb8d27208bb975ad99d621ab8e9c4_sk
            │   │   ├── signcerts
            │   │   │   └── cert.pem
            │   │   ├── tlscacerts
            │   │   │   └── ca.crt
            │   │   └── user
            │   ├── peers
            │   │   ├── peer0.org1.com
            │   │   │   ├── msp
            │   │   │   │   ├── cacerts
            │   │   │   │   │   └── localhost-8060-ca-org1-com.pem
            │   │   │   │   ├── config.yaml
            │   │   │   │   ├── IssuerPublicKey
            │   │   │   │   ├── IssuerRevocationPublicKey
            │   │   │   │   ├── keystore
            │   │   │   │   │   └── 8f15519ce07cf36f173fb71ec7d769a91f026eb7893e97a2c5c6b901a1f9e16d_sk
            │   │   │   │   ├── signcerts
            │   │   │   │   │   └── cert.pem
            │   │   │   │   └── user
            │   │   │   └── tls
            │   │   │       ├── cacerts
            │   │   │       ├── ca.crt
            │   │   │       ├── IssuerPublicKey
            │   │   │       ├── IssuerRevocationPublicKey
            │   │   │       ├── keystore
            │   │   │       │   └── 6fcd9fe3dfbc01c292545fbfbfc92d93bef81a569079d1413d495b6e5640d0fc_sk
            │   │   │       ├── server.crt
            │   │   │       ├── server.key
            │   │   │       ├── signcerts
            │   │   │       │   └── cert.pem
            │   │   │       ├── tlscacerts
            │   │   │       │   └── tls-localhost-8060-ca-org1-com.pem
            │   │   │       └── user
            │   │   └── peer1.org1.com
            │   │       ├── msp
            │   │       │   ├── cacerts
            │   │       │   │   └── localhost-8060-ca-org1-com.pem
            │   │       │   ├── config.yaml
            │   │       │   ├── IssuerPublicKey
            │   │       │   ├── IssuerRevocationPublicKey
            │   │       │   ├── keystore
            │   │       │   │   └── 55564151aab4f0133c7284cd74f63277654c0d95c6a177f1c7b886446e4b462b_sk
            │   │       │   ├── signcerts
            │   │       │   │   └── cert.pem
            │   │       │   └── user
            │   │       └── tls
            │   │           ├── cacerts
            │   │           ├── ca.crt
            │   │           ├── IssuerPublicKey
            │   │           ├── IssuerRevocationPublicKey
            │   │           ├── keystore
            │   │           │   └── 960213c7df8abdc6ea224e26afdeb78a6340b3b92597ab7221d8915210243086_sk
            │   │           ├── server.crt
            │   │           ├── server.key
            │   │           ├── signcerts
            │   │           │   └── cert.pem
            │   │           ├── tlscacerts
            │   │           │   └── tls-localhost-8060-ca-org1-com.pem
            │   │           └── user
            │   ├── tlsca
            │   │   └── tlsca.org1.com-cert.pem
            │   └── users
            │       ├── Admin@org1.com
            │       │   └── msp
            │       │       ├── cacerts
            │       │       │   └── localhost-8060-ca-org1-com.pem
            │       │       ├── config.yaml
            │       │       ├── IssuerPublicKey
            │       │       ├── IssuerRevocationPublicKey
            │       │       ├── keystore
            │       │       │   └── 2945ba21fac8e41975424c78b46f18f612898e18bd6682de369bd5be999591aa_sk
            │       │       ├── signcerts
            │       │       │   └── cert.pem
            │       │       └── user
            │       └── User1@org1.com
            │           └── msp
            │               ├── cacerts
            │               │   └── localhost-8060-ca-org1-com.pem
            │               ├── IssuerPublicKey
            │               ├── IssuerRevocationPublicKey
            │               ├── keystore
            │               │   └── edee88ae4e7fc8f7e2f58d450743612f016eac99b623dfe7365fb678500e7908_sk
            │               ├── signcerts
            │               │   └── cert.pem
            │               └── user
            ├── org2.com
            │   ├── ca
            │   │   └── ca.org2.com-cert.pem
            │   ├── fabric-ca-client-config.yaml
            │   ├── msp
            │   │   ├── cacerts
            │   │   │   └── localhost-9060-ca-org2-com.pem
            │   │   ├── config.yaml
            │   │   ├── IssuerPublicKey
            │   │   ├── IssuerRevocationPublicKey
            │   │   ├── keystore
            │   │   │   └── dd2969ceac12e291bdd4dbed8daec82d036557a84349f30dde536e834d3c730f_sk
            │   │   ├── signcerts
            │   │   │   └── cert.pem
            │   │   ├── tlscacerts
            │   │   │   └── ca.crt
            │   │   └── user
            │   ├── peers
            │   │   ├── peer0.org2.com
            │   │   │   ├── msp
            │   │   │   │   ├── cacerts
            │   │   │   │   │   └── localhost-9060-ca-org2-com.pem
            │   │   │   │   ├── config.yaml
            │   │   │   │   ├── IssuerPublicKey
            │   │   │   │   ├── IssuerRevocationPublicKey
            │   │   │   │   ├── keystore
            │   │   │   │   │   └── b7021c7d50f7cb4bb68c7cc0a9b0415a6fa0f062ba734886054e2b87693464a5_sk
            │   │   │   │   ├── signcerts
            │   │   │   │   │   └── cert.pem
            │   │   │   │   └── user
            │   │   │   └── tls
            │   │   │       ├── cacerts
            │   │   │       ├── ca.crt
            │   │   │       ├── IssuerPublicKey
            │   │   │       ├── IssuerRevocationPublicKey
            │   │   │       ├── keystore
            │   │   │       │   └── e8ea7fbb7f20d798d90cfc6b3e5ae876ecb81196144c2ab596f1018f5dfffb32_sk
            │   │   │       ├── server.crt
            │   │   │       ├── server.key
            │   │   │       ├── signcerts
            │   │   │       │   └── cert.pem
            │   │   │       ├── tlscacerts
            │   │   │       │   └── tls-localhost-9060-ca-org2-com.pem
            │   │   │       └── user
            │   │   └── peer1.org2.com
            │   │       ├── msp
            │   │       │   ├── cacerts
            │   │       │   │   └── localhost-9060-ca-org2-com.pem
            │   │       │   ├── config.yaml
            │   │       │   ├── IssuerPublicKey
            │   │       │   ├── IssuerRevocationPublicKey
            │   │       │   ├── keystore
            │   │       │   │   └── fdde338684602073273c4a26c60865b274b6198650f21807810cbba7765c4357_sk
            │   │       │   ├── signcerts
            │   │       │   │   └── cert.pem
            │   │       │   └── user
            │   │       └── tls
            │   │           ├── cacerts
            │   │           ├── ca.crt
            │   │           ├── IssuerPublicKey
            │   │           ├── IssuerRevocationPublicKey
            │   │           ├── keystore
            │   │           │   └── 5c8557532719ccb9de678b230383b374c0c5459726be68a24bd9e7d936bcf20d_sk
            │   │           ├── server.crt
            │   │           ├── server.key
            │   │           ├── signcerts
            │   │           │   └── cert.pem
            │   │           ├── tlscacerts
            │   │           │   └── tls-localhost-9060-ca-org2-com.pem
            │   │           └── user
            │   ├── tlsca
            │   │   └── tlsca.org2.com-cert.pem
            │   └── users
            │       ├── Admin@org2.com
            │       │   └── msp
            │       │       ├── cacerts
            │       │       │   └── localhost-9060-ca-org2-com.pem
            │       │       ├── config.yaml
            │       │       ├── IssuerPublicKey
            │       │       ├── IssuerRevocationPublicKey
            │       │       ├── keystore
            │       │       │   └── c30d01374d99d1812ebcdd4467073788501a3dac79a72b3c4079147dd451de61_sk
            │       │       ├── signcerts
            │       │       │   └── cert.pem
            │       │       └── user
            │       └── User1@org2.com
            │           └── msp
            │               ├── cacerts
            │               │   └── localhost-9060-ca-org2-com.pem
            │               ├── IssuerPublicKey
            │               ├── IssuerRevocationPublicKey
            │               ├── keystore
            │               │   └── c470ea5220526760b4972b34277fbe0d46dce10b4c0a27c7aebe2cd7624c8d17_sk
            │               ├── signcerts
            │               │   └── cert.pem
            │               └── user
            └── org3.com
                ├── ca
                │   └── ca.org3.com-cert.pem
                ├── fabric-ca-client-config.yaml
                ├── msp
                │   ├── cacerts
                │   │   └── localhost-10060-ca-org3-com.pem
                │   ├── config.yaml
                │   ├── IssuerPublicKey
                │   ├── IssuerRevocationPublicKey
                │   ├── keystore
                │   │   └── 2dbf04b901b91f7ea778c2425bc0e0f9e286d5e26c43edb84de4d005db53f1f3_sk
                │   ├── signcerts
                │   │   └── cert.pem
                │   ├── tlscacerts
                │   │   └── ca.crt
                │   └── user
                ├── peers
                │   ├── peer0.org3.com
                │   │   ├── msp
                │   │   │   ├── cacerts
                │   │   │   │   └── localhost-10060-ca-org3-com.pem
                │   │   │   ├── config.yaml
                │   │   │   ├── IssuerPublicKey
                │   │   │   ├── IssuerRevocationPublicKey
                │   │   │   ├── keystore
                │   │   │   │   └── 651b463d89f9b7fdf1cafa28f8a6cec5952d1307d7f8581a972d9d13d55a4ae1_sk
                │   │   │   ├── signcerts
                │   │   │   │   └── cert.pem
                │   │   │   └── user
                │   │   └── tls
                │   │       ├── cacerts
                │   │       ├── ca.crt
                │   │       ├── IssuerPublicKey
                │   │       ├── IssuerRevocationPublicKey
                │   │       ├── keystore
                │   │       │   └── 35b5c9d62a78e10e4a16f059cec99cfc4ea11ed814096ffb12b8423556e8982b_sk
                │   │       ├── server.crt
                │   │       ├── server.key
                │   │       ├── signcerts
                │   │       │   └── cert.pem
                │   │       ├── tlscacerts
                │   │       │   └── tls-localhost-10060-ca-org3-com.pem
                │   │       └── user
                │   └── peer1.org3.com
                │       ├── msp
                │       │   ├── cacerts
                │       │   │   └── localhost-10060-ca-org3-com.pem
                │       │   ├── config.yaml
                │       │   ├── IssuerPublicKey
                │       │   ├── IssuerRevocationPublicKey
                │       │   ├── keystore
                │       │   │   └── 636fa3bc04bf80334b4885f906840134ddefba242d37f506544ef598171921e8_sk
                │       │   ├── signcerts
                │       │   │   └── cert.pem
                │       │   └── user
                │       └── tls
                │           ├── cacerts
                │           ├── ca.crt
                │           ├── IssuerPublicKey
                │           ├── IssuerRevocationPublicKey
                │           ├── keystore
                │           │   └── bcd8fa8bcc904c99666f7ae11ad409b879c4232d765e864fd32d5c8788db1c5a_sk
                │           ├── server.crt
                │           ├── server.key
                │           ├── signcerts
                │           │   └── cert.pem
                │           ├── tlscacerts
                │           │   └── tls-localhost-10060-ca-org3-com.pem
                │           └── user
                ├── tlsca
                │   └── tlsca.org3.com-cert.pem
                └── users
                    ├── Admin@org3.com
                    │   └── msp
                    │       ├── cacerts
                    │       │   └── localhost-10060-ca-org3-com.pem
                    │       ├── config.yaml
                    │       ├── IssuerPublicKey
                    │       ├── IssuerRevocationPublicKey
                    │       ├── keystore
                    │       │   └── 71ba02512d3d751fd121341dc665e4982349a3469411317cee612e316b6c68d9_sk
                    │       ├── signcerts
                    │       │   └── cert.pem
                    │       └── user
                    └── User1@org3.com
                        └── msp
                            ├── cacerts
                            │   └── localhost-10060-ca-org3-com.pem
                            ├── IssuerPublicKey
                            ├── IssuerRevocationPublicKey
                            ├── keystore
                            │   └── 72d59be6c8ae17221a299c51470f412132e7ab3efe2cc144361d4c8c75837542_sk
                            ├── signcerts
                            │   └── cert.pem
                            └── user
# ubuntu 22 or 20
sudo apt-get update
sudo apt-get upgrade -y

# git
sudo apt-get install git -y

# curl
sudo apt-get install curl -y

# build-essential
sudo apt install build-essential

# jq 
sudo apt-get install jq -y

#vscode -> go, docker extension install

# docker
sudo apt-get install docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ${USER}
docker --version
docker-compose --version
sudo reboot

# node.js, nvm, npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
sudo reboot
nvm install l6
nvm -v
node -v
npm -v

# go
sudo apt remove 'golang-*'
wget https://go.dev/dl/go1.20.5.linux-amd64.tar.gz
tar xf go1.20.5.linux-amd64.tar.gz
sudo mv go /usr/local/go
# add three line bottom of profile
gedit .profile
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin:$GOPATH/src/fabir-samples/bin
source .profile
go version

# fabric-samples
echo $HOME
mkdir -p $HOME/go/src
cd $HOME/go/src/
curl -sSL https://bit.ly/2ysbOFE | bash -s
docker pull hyperledger/fabric-couchdb:latest

# go packageing for chaincode
cd {chaincode/path}
go mod init
go mod tidy
GO111MODULE=on go mod vendor

# shellscript permmison denied
cd $HOME/hlf/did/network
chmod777 network.sh