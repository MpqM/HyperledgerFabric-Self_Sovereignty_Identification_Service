export PATH=$PATH:$PWD/bin
export FABRIC_CFG_PATH=$PWD/config
SYS_CHANNEL="syschannel"
CHANNEL_NAME="didchannel"

# [0] 통합 진행
function Start(){
  CreateMspAll
  CreateSystemArtifact
  RunComponent
  SetChannel
  DeployCC
  TestCC
  chmod -R 777 ./artifact
}

# [1] fabric 네트워크에서 msp생성
#  (*) 자동화 및 테스트
function CreateMspAll(){
    docker-compose -f ./docker-compose/docker-compose-ca.yaml up -d ca.ordererorg.com ca.org1.com ca.org2.com ca.org3.com
    mkdir -p ./artifact
    sleep 3
    CreateMspOrdererOrg
    CreateMspOrg1
    CreateMspOrg2
    CreateMspOrg3
}

#  (1) ordererorg의 msp 생성
function CreateMspOrdererOrg {
    echo "############################"
    echo "### CreateMspOrdererorg ###"
    echo "############################"
    echo "###########################"
    echo "### Enroll the ca admin ###"
    echo "###########################"
    mkdir -p ./artifact/crypto-config/ordererOrganizations/ordererorg.com
    export FABRIC_CA_CLIENT_HOME=${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com
    fabric-ca-client enroll -u https://admin:adminpw@localhost:7060 --caname ca.ordererorg.com --tls.certfiles ${PWD}/artifact/fabric-ca/ordererorg/tls-cert.pem
    
    echo 'NodeOUs:
    Enable: true
    ClientOUIdentifier:
        Certificate: cacerts/localhost-7060-ca-ordererorg-com.pem
        OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
        Certificate: cacerts/localhost-7060-ca-ordererorg-com.pem
        OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
        Certificate: cacerts/localhost-7060-ca-ordererorg-com.pem
        OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier:
        Certificate: cacerts/localhost-7060-ca-ordererorg-com.pem
        OrganizationalUnitIdentifier: orderer' >${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/msp/config.yaml

    echo "#########################"
    echo "### Register orderer0 ###"
    echo "#########################"
    fabric-ca-client register --caname ca.ordererorg.com --id.name orderer0.ordererorg.com --id.secret orderer0.ordererorg.com_pw --id.type orderer --tls.certfiles ${PWD}/artifact/fabric-ca/ordererorg/tls-cert.pem
    
    echo "#########################"
    echo "### Register orderer1 ###"
    echo "#########################"
    fabric-ca-client register --caname ca.ordererorg.com --id.name orderer1.ordererorg.com --id.secret orderer1.ordererorg.com_pw --id.type orderer --tls.certfiles ${PWD}/artifact/fabric-ca/ordererorg/tls-cert.pem
    
    echo "#########################"
    echo "### Register orderer2 ###"
    echo "#########################"
    fabric-ca-client register --caname ca.ordererorg.com --id.name orderer2.ordererorg.com --id.secret orderer2.ordererorg.com_pw --id.type orderer --tls.certfiles ${PWD}/artifact/fabric-ca/ordererorg/tls-cert.pem
    
    echo "##################################"
    echo "### Register the orderer admin ###"
    echo "##################################"
    fabric-ca-client register --caname ca.ordererorg.com --id.name orderera.ordererorg.com --id.secret orderera.ordererorg.com_pw --id.type admin --tls.certfiles ${PWD}/artifact/fabric-ca/ordererorg/tls-cert.pem

    mkdir -p ./artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer0.ordererorg.com
    mkdir -p ./artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer1.ordererorg.com
    mkdir -p ./artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer2.ordererorg.com
    mkdir -p ./artifact/crypto-config/ordererOrganizations/ordererorg.com/users/Admin@ordererorg.com

    echo "#################################"
    echo "### Generate the orderer0 msp ###"
    echo "#################################"
    fabric-ca-client enroll -u https://orderer0.ordererorg.com:orderer0.ordererorg.com_pw@localhost:7060 --caname ca.ordererorg.com  -M ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer0.ordererorg.com/msp --csr.hosts orderer0.ordererorg.com --csr.hosts localhost --tls.certfiles ${PWD}/artifact/fabric-ca/ordererorg/tls-cert.pem
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/msp/config.yaml ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer0.ordererorg.com/msp/config.yaml
    
    echo "################################################"
    echo "### Generate the orderer0 tls-certifications ###"
    echo "################################################"
    fabric-ca-client enroll -u https://orderer0.ordererorg.com:orderer0.ordererorg.com_pw@localhost:7060  --caname ca.ordererorg.com -M ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer0.ordererorg.com/tls --enrollment.profile tls --csr.hosts orderer0.ordererorg.com --csr.hosts localhost --tls.certfiles ${PWD}/artifact/fabric-ca/ordererorg/tls-cert.pem
    
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer0.ordererorg.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer0.ordererorg.com/tls/ca.crt
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer0.ordererorg.com/tls/signcerts/* ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer0.ordererorg.com/tls/server.crt
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer0.ordererorg.com/tls/keystore/* ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer0.ordererorg.com/tls/server.key
    mkdir ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer0.ordererorg.com/msp/tlscacerts
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer0.ordererorg.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer0.ordererorg.com/msp/tlscacerts/tlsca.ordererorg.com-cert.pem
    mkdir ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/msp/tlscacerts
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer0.ordererorg.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/msp/tlscacerts/tlsca.ordererorg.com-cert.pem

    echo "#################################"
    echo "### Generate the orderer1 msp ###"
    echo "#################################"
    fabric-ca-client enroll -u https://orderer1.ordererorg.com:orderer1.ordererorg.com_pw@localhost:7060 --caname ca.ordererorg.com  -M ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer1.ordererorg.com/msp --csr.hosts orderer1.ordererorg.com --csr.hosts localhost --tls.certfiles ${PWD}/artifact/fabric-ca/ordererorg/tls-cert.pem
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/msp/config.yaml ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer1.ordererorg.com/msp/config.yaml
    
    echo "################################################"
    echo "### Generate the orderer1 tls-certifications ###"
    echo "################################################"
    fabric-ca-client enroll -u https://orderer1.ordererorg.com:orderer1.ordererorg.com_pw@localhost:7060  --caname ca.ordererorg.com -M ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer1.ordererorg.com/tls --enrollment.profile tls --csr.hosts orderer1.ordererorg.com --csr.hosts localhost --tls.certfiles ${PWD}/artifact/fabric-ca/ordererorg/tls-cert.pem
    
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer1.ordererorg.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer1.ordererorg.com/tls/ca.crt
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer1.ordererorg.com/tls/signcerts/* ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer1.ordererorg.com/tls/server.crt
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer1.ordererorg.com/tls/keystore/* ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer1.ordererorg.com/tls/server.key
    mkdir ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer1.ordererorg.com/msp/tlscacerts
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer1.ordererorg.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer1.ordererorg.com/msp/tlscacerts/tlsca.ordererorg.com-cert.pem
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer1.ordererorg.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/msp/tlscacerts/tlsca.ordererorg.com-cert.pem

    echo "#################################"
    echo "### Generate the orderer2 msp ###"
    echo "#################################"
    fabric-ca-client enroll -u https://orderer2.ordererorg.com:orderer2.ordererorg.com_pw@localhost:7060 --caname ca.ordererorg.com  -M ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer2.ordererorg.com/msp --csr.hosts orderer2.ordererorg.com --csr.hosts localhost --tls.certfiles ${PWD}/artifact/fabric-ca/ordererorg/tls-cert.pem
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/msp/config.yaml ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer2.ordererorg.com/msp/config.yaml
    
    echo "################################################"
    echo "### Generate the orderer2 tls-certifications ###"
    echo "################################################"
    fabric-ca-client enroll -u https://orderer2.ordererorg.com:orderer2.ordererorg.com_pw@localhost:7060  --caname ca.ordererorg.com -M ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer2.ordererorg.com/tls --enrollment.profile tls --csr.hosts orderer2.ordererorg.com --csr.hosts localhost --tls.certfiles ${PWD}/artifact/fabric-ca/ordererorg/tls-cert.pem
    
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer2.ordererorg.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer2.ordererorg.com/tls/ca.crt
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer2.ordererorg.com/tls/signcerts/* ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer2.ordererorg.com/tls/server.crt
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer2.ordererorg.com/tls/keystore/* ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer2.ordererorg.com/tls/server.key
    mkdir ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer2.ordererorg.com/msp/tlscacerts
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer2.ordererorg.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer2.ordererorg.com/msp/tlscacerts/tlsca.ordererorg.com-cert.pem
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer2.ordererorg.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/msp/tlscacerts/tlsca.ordererorg.com-cert.pem

    echo "##############################"
    echo "### Generate the admin msp ###"
    echo "##############################"
    fabric-ca-client enroll -u https://orderera.ordererorg.com:orderera.ordererorg.com_pw@localhost:7060 --caname ca.ordererorg.com -M ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/users/Admin@ordererorg.com/msp --tls.certfiles ${PWD}/artifact/fabric-ca/ordererorg/tls-cert.pem
    cp ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/msp/config.yaml ${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/users/Admin@ordererorg.com/msp/config.yaml
}

#  (2) org1의 msp 생성
function CreateMspOrg1 {
    echo "######################"
    echo "### CreateMspOrg1 ###"
    echo "######################"
    echo "###########################"
    echo "### Enroll the ca admin ###"
    echo "###########################"
    mkdir -p ./artifact/crypto-config/peerOrganizations/org1.com/
    export FABRIC_CA_CLIENT_HOME=${PWD}/artifact/crypto-config/peerOrganizations/org1.com/
    fabric-ca-client enroll -u https://admin:adminpw@localhost:8060 --caname ca.org1.com --tls.certfiles ${PWD}/artifact/fabric-ca/org1/tls-cert.pem
    
    echo 'NodeOUs:
    Enable: true
    ClientOUIdentifier:
        Certificate: cacerts/localhost-8060-ca-org1-com.pem
        OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
        Certificate: cacerts/localhost-8060-ca-org1-com.pem
        OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
        Certificate: cacerts/localhost-8060-ca-org1-com.pem
        OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier:
        Certificate: cacerts/localhost-8060-ca-org1-com.pem
        OrganizationalUnitIdentifier: orderer' >${PWD}/artifact/crypto-config/peerOrganizations/org1.com/msp/config.yaml

    echo "###########################"
    echo "### Register org1 peer0 ###"
    echo "###########################"
    fabric-ca-client register --caname ca.org1.com --id.name peer0.org1.com --id.secret peer0.org1.com_pw --id.type peer --tls.certfiles ${PWD}/artifact/fabric-ca/org1/tls-cert.pem
    
    echo "###########################"
    echo "### Register org1 peer1 ###"
    echo "###########################"
    fabric-ca-client register --caname ca.org1.com --id.name peer1.org1.com --id.secret peer1.org1.com_pw --id.type peer --tls.certfiles ${PWD}/artifact/fabric-ca/org1/tls-cert.pem
    
    echo "##########################"
    echo "### Register org1 user ###"
    echo "##########################"
    fabric-ca-client register --caname ca.org1.com --id.name peeru.org1.com --id.secret peeru.org1.com_pw --id.type client --tls.certfiles ${PWD}/artifact/fabric-ca/org1/tls-cert.pem
    
    echo "###########################"
    echo "### Register org1 admin ###"
    echo "###########################"
    fabric-ca-client register --caname ca.org1.com --id.name peera.org1.com --id.secret peera.org1.com_pw --id.type admin --tls.certfiles ${PWD}/artifact/fabric-ca/org1/tls-cert.pem

    mkdir -p ./artifact/crypto-config/peerOrganizations/org1.com/peers
    mkdir -p ./artifact/crypto-config/peerOrganizations/org1.com/peers/peer0.org1.com
    mkdir -p ./artifact/crypto-config/peerOrganizations/org1.com/peers/peer1.org1.com
    mkdir -p ./artifact/crypto-config/peerOrganizations/org1.com/users/User1@org1.com
    mkdir -p ./artifact/crypto-config/peerOrganizations/org1.com/users/Admin@org1.com

    echo "##############################"
    echo "### Generate the peer0 msp ###"
    echo "##############################"
    fabric-ca-client enroll -u https://peer0.org1.com:peer0.org1.com_pw@localhost:8060 --caname ca.org1.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer0.org1.com/msp --csr.hosts peer0.org1.com --tls.certfiles ${PWD}/artifact/fabric-ca/org1/tls-cert.pem
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/msp/config.yaml ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer0.org1.com/msp/config.yaml
    
    echo "###########################################"
    echo "### Generate the peer0-tls certificates ###"
    echo "###########################################"
    fabric-ca-client enroll -u https://peer0.org1.com:peer0.org1.com_pw@localhost:8060 --caname ca.org1.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer0.org1.com/tls --enrollment.profile tls --csr.hosts peer0.org1.com --csr.hosts localhost --tls.certfiles ${PWD}/artifact/fabric-ca/org1/tls-cert.pem
    
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer0.org1.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer0.org1.com/tls/ca.crt
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer0.org1.com/tls/signcerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer0.org1.com/tls/server.crt
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer0.org1.com/tls/keystore/* ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer0.org1.com/tls/server.key
    mkdir ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/msp/tlscacerts
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer0.org1.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/msp/tlscacerts/ca.crt
    mkdir ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/tlsca
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer0.org1.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/tlsca/tlsca.org1.com-cert.pem
    mkdir ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/ca
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer0.org1.com/msp/cacerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/ca/ca.org1.com-cert.pem

    echo "##############################"
    echo "### Generate the peer1 msp ###"
    echo "##############################"
    fabric-ca-client enroll -u https://peer1.org1.com:peer1.org1.com_pw@localhost:8060 --caname ca.org1.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer1.org1.com/msp --csr.hosts peer1.org1.com --tls.certfiles ${PWD}/artifact/fabric-ca/org1/tls-cert.pem
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/msp/config.yaml ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer1.org1.com/msp/config.yaml
    
    echo "###########################################"
    echo "### Generate the peer1-tls certificates ###"
    echo "###########################################"
    fabric-ca-client enroll -u https://peer1.org1.com:peer1.org1.com_pw@localhost:8060 --caname ca.org1.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer1.org1.com/tls --enrollment.profile tls --csr.hosts peer1.org1.com --csr.hosts localhost --tls.certfiles ${PWD}/artifact/fabric-ca/org1/tls-cert.pem
    
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer1.org1.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer1.org1.com/tls/ca.crt
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer1.org1.com/tls/signcerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer1.org1.com/tls/server.crt
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer1.org1.com/tls/keystore/* ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer1.org1.com/tls/server.key

    echo "#############################"
    echo "### Generate the user msp ###"
    echo "#############################"
    fabric-ca-client enroll -u https://peeru.org1.com:peeru.org1.com_pw@localhost:8060 --caname ca.org1.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/users/User1@org1.com/msp --tls.certfiles ${PWD}/artifact/fabric-ca/org1/tls-cert.pem
    
    echo "##############################"
    echo "### Generate the admin msp ###"
    echo "##############################"
    fabric-ca-client enroll -u https://peera.org1.com:peera.org1.com_pw@localhost:8060 --caname ca.org1.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/users/Admin@org1.com/msp --tls.certfiles ${PWD}/artifact/fabric-ca/org1/tls-cert.pem
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/msp/config.yaml ${PWD}/artifact/crypto-config/peerOrganizations/org1.com/users/Admin@org1.com/msp/config.yaml
}

#  (3) org2의 msp 생성
function CreateMspOrg2 {
    echo "#####################"
    echo "### CreateMspOrg2 ###"
    echo "#####################"
    echo "###########################"
    echo "### Enroll the ca admin ###"
    echo "###########################"
    mkdir -p ./artifact/crypto-config/peerOrganizations/org2.com/
    export FABRIC_CA_CLIENT_HOME=${PWD}/artifact/crypto-config/peerOrganizations/org2.com/
    fabric-ca-client enroll -u https://admin:adminpw@localhost:9060 --caname ca.org2.com --tls.certfiles ${PWD}/artifact/fabric-ca/org2/tls-cert.pem
    
    echo 'NodeOUs:
    Enable: true
    ClientOUIdentifier:
        Certificate: cacerts/localhost-9060-ca-org2-com.pem
        OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
        Certificate: cacerts/localhost-9060-ca-org2-com.pem
        OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
        Certificate: cacerts/localhost-9060-ca-org2-com.pem
        OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier:
        Certificate: cacerts/localhost-9060-ca-org2-com.pem
        OrganizationalUnitIdentifier: orderer' >${PWD}/artifact/crypto-config/peerOrganizations/org2.com/msp/config.yaml

    echo "###########################"
    echo "### Register org2 peer0 ###"
    echo "###########################"
    fabric-ca-client register --caname ca.org2.com --id.name peer0.org2.com --id.secret peer0.org2.com_pw --id.type peer --tls.certfiles ${PWD}/artifact/fabric-ca/org2/tls-cert.pem
    
    echo "###########################"
    echo "### Register org2 peer1 ###"
    echo "###########################"
    fabric-ca-client register --caname ca.org2.com --id.name peer1.org2.com --id.secret peer1.org2.com_pw --id.type peer --tls.certfiles ${PWD}/artifact/fabric-ca/org2/tls-cert.pem
    
    echo "##########################"
    echo "### Register org2 user ###"
    echo "##########################"
    fabric-ca-client register --caname ca.org2.com --id.name peeru.org2.com --id.secret peeru.org2.com_pw --id.type client --tls.certfiles ${PWD}/artifact/fabric-ca/org2/tls-cert.pem
    
    echo "###########################"
    echo "### Register org2 admin ###"
    echo "###########################"
    fabric-ca-client register --caname ca.org2.com --id.name peera.org2.com --id.secret peera.org2.com_pw --id.type admin --tls.certfiles ${PWD}/artifact/fabric-ca/org2/tls-cert.pem

    mkdir -p ./artifact/crypto-config/peerOrganizations/org2.com/peers
    mkdir -p ./artifact/crypto-config/peerOrganizations/org2.com/peers/peer0.org2.com
    mkdir -p ./artifact/crypto-config/peerOrganizations/org2.com/peers/peer1.org2.com
    mkdir -p ./artifact/crypto-config/peerOrganizations/org2.com/users/User1@org2.com
    mkdir -p ./artifact/crypto-config/peerOrganizations/org2.com/users/Admin@org2.com

    echo "##############################"
    echo "### Generate the peer0 msp ###"
    echo "##############################"
    fabric-ca-client enroll -u https://peer0.org2.com:peer0.org2.com_pw@localhost:9060 --caname ca.org2.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer0.org2.com/msp --csr.hosts peer0.org2.com --tls.certfiles ${PWD}/artifact/fabric-ca/org2/tls-cert.pem
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/msp/config.yaml ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer0.org2.com/msp/config.yaml
    
    echo "###########################################"
    echo "### Generate the peer0-tls certificates ###"
    echo "###########################################"
    fabric-ca-client enroll -u https://peer0.org2.com:peer0.org2.com_pw@localhost:9060 --caname ca.org2.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer0.org2.com/tls --enrollment.profile tls --csr.hosts peer0.org2.com --csr.hosts localhost --tls.certfiles ${PWD}/artifact/fabric-ca/org2/tls-cert.pem
    
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer0.org2.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer0.org2.com/tls/ca.crt
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer0.org2.com/tls/signcerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer0.org2.com/tls/server.crt
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer0.org2.com/tls/keystore/* ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer0.org2.com/tls/server.key
    mkdir ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/msp/tlscacerts
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer0.org2.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/msp/tlscacerts/ca.crt
    mkdir ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/tlsca
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer0.org2.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/tlsca/tlsca.org2.com-cert.pem
    mkdir ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/ca
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer0.org2.com/msp/cacerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/ca/ca.org2.com-cert.pem

    echo "##############################"
    echo "### Generate the peer1 msp ###"
    echo "##############################"
    fabric-ca-client enroll -u https://peer1.org2.com:peer1.org2.com_pw@localhost:9060 --caname ca.org2.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer1.org2.com/msp --csr.hosts peer1.org2.com --tls.certfiles ${PWD}/artifact/fabric-ca/org2/tls-cert.pem
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/msp/config.yaml ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer1.org2.com/msp/config.yaml
    
    echo "###########################################"
    echo "### Generate the peer1-tls certificates ###"
    echo "###########################################"
    fabric-ca-client enroll -u https://peer1.org2.com:peer1.org2.com_pw@localhost:9060 --caname ca.org2.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer1.org2.com/tls --enrollment.profile tls --csr.hosts peer1.org2.com --csr.hosts localhost --tls.certfiles ${PWD}/artifact/fabric-ca/org2/tls-cert.pem
    
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer1.org2.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer1.org2.com/tls/ca.crt
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer1.org2.com/tls/signcerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer1.org2.com/tls/server.crt
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer1.org2.com/tls/keystore/* ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer1.org2.com/tls/server.key

    echo "#############################"
    echo "### Generate the user msp ###"
    echo "#############################"
    fabric-ca-client enroll -u https://peeru.org2.com:peeru.org2.com_pw@localhost:9060 --caname ca.org2.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/users/User1@org2.com/msp --tls.certfiles ${PWD}/artifact/fabric-ca/org2/tls-cert.pem
    
    echo "##############################"
    echo "### Generate the admin msp ###"
    echo "##############################"
    fabric-ca-client enroll -u https://peera.org2.com:peera.org2.com_pw@localhost:9060 --caname ca.org2.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/users/Admin@org2.com/msp --tls.certfiles ${PWD}/artifact/fabric-ca/org2/tls-cert.pem
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/msp/config.yaml ${PWD}/artifact/crypto-config/peerOrganizations/org2.com/users/Admin@org2.com/msp/config.yaml
}

#  (4) org3의 msp 생성
function CreateMspOrg3 {
    echo "#####################"
    echo "### CreateMspOrg3 ###"
    echo "#####################"
    echo "###########################"
    echo "### Enroll the ca admin ###"
    echo "###########################"
    mkdir -p ./artifact/crypto-config/peerOrganizations/org3.com/
    export FABRIC_CA_CLIENT_HOME=${PWD}/artifact/crypto-config/peerOrganizations/org3.com/
    fabric-ca-client enroll -u https://admin:adminpw@localhost:10060 --caname ca.org3.com --tls.certfiles ${PWD}/artifact/fabric-ca/org3/tls-cert.pem
    
    echo 'NodeOUs:
    Enable: true
    ClientOUIdentifier:
        Certificate: cacerts/localhost-10060-ca-org3-com.pem
        OrganizationalUnitIdentifier: client
    PeerOUIdentifier:
        Certificate: cacerts/localhost-10060-ca-org3-com.pem
        OrganizationalUnitIdentifier: peer
    AdminOUIdentifier:
        Certificate: cacerts/localhost-10060-ca-org3-com.pem
        OrganizationalUnitIdentifier: admin
    OrdererOUIdentifier:
        Certificate: cacerts/localhost-10060-ca-org3-com.pem
        OrganizationalUnitIdentifier: orderer' >${PWD}/artifact/crypto-config/peerOrganizations/org3.com/msp/config.yaml

    echo "###########################"
    echo "### Register org3 peer0 ###"
    echo "###########################"
    fabric-ca-client register --caname ca.org3.com --id.name peer0.org3.com --id.secret peer0.org3.com_pw --id.type peer --tls.certfiles ${PWD}/artifact/fabric-ca/org3/tls-cert.pem
    
    echo "###########################"
    echo "### Register org3 peer1 ###"
    echo "###########################"
    fabric-ca-client register --caname ca.org3.com --id.name peer1.org3.com --id.secret peer1.org3.com_pw --id.type peer --tls.certfiles ${PWD}/artifact/fabric-ca/org3/tls-cert.pem
    
    echo "##########################"
    echo "### Register org3 user ###"
    echo "##########################"
    fabric-ca-client register --caname ca.org3.com --id.name peeru.org3.com --id.secret peeru.org3.com_pw --id.type client --tls.certfiles ${PWD}/artifact/fabric-ca/org3/tls-cert.pem
    
    echo "###########################"
    echo "### Register org3 admin ###"
    echo "###########################"
    fabric-ca-client register --caname ca.org3.com --id.name peera.org3.com --id.secret peera.org3.com_pw --id.type admin --tls.certfiles ${PWD}/artifact/fabric-ca/org3/tls-cert.pem

    mkdir -p ./artifact/crypto-config/peerOrganizations/org3.com/peers
    mkdir -p ./artifact/crypto-config/peerOrganizations/org3.com/peers/peer0.org3.com
    mkdir -p ./artifact/crypto-config/peerOrganizations/org3.com/peers/peer1.org3.com
    mkdir -p ./artifact/crypto-config/peerOrganizations/org3.com/users/User1@org3.com
    mkdir -p ./artifact/crypto-config/peerOrganizations/org3.com/users/Admin@org3.com

    echo "##############################"
    echo "### Generate the peer0 msp ###"
    echo "##############################"
    fabric-ca-client enroll -u https://peer0.org3.com:peer0.org3.com_pw@localhost:10060 --caname ca.org3.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer0.org3.com/msp --csr.hosts peer0.org3.com --tls.certfiles ${PWD}/artifact/fabric-ca/org3/tls-cert.pem
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/msp/config.yaml ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer0.org3.com/msp/config.yaml
    
    echo "###########################################"
    echo "### Generate the peer0-tls certificates ###"
    echo "###########################################"
    fabric-ca-client enroll -u https://peer0.org3.com:peer0.org3.com_pw@localhost:10060 --caname ca.org3.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer0.org3.com/tls --enrollment.profile tls --csr.hosts peer0.org3.com --csr.hosts localhost --tls.certfiles ${PWD}/artifact/fabric-ca/org3/tls-cert.pem
    
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer0.org3.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer0.org3.com/tls/ca.crt
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer0.org3.com/tls/signcerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer0.org3.com/tls/server.crt
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer0.org3.com/tls/keystore/* ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer0.org3.com/tls/server.key
    mkdir ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/msp/tlscacerts
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer0.org3.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/msp/tlscacerts/ca.crt
    mkdir ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/tlsca
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer0.org3.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/tlsca/tlsca.org3.com-cert.pem
    mkdir ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/ca
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer0.org3.com/msp/cacerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/ca/ca.org3.com-cert.pem

    echo "##############################"
    echo "### Generate the peer1 msp ###"
    echo "##############################"
    fabric-ca-client enroll -u https://peer1.org3.com:peer1.org3.com_pw@localhost:10060 --caname ca.org3.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer1.org3.com/msp --csr.hosts peer1.org3.com --tls.certfiles ${PWD}/artifact/fabric-ca/org3/tls-cert.pem
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/msp/config.yaml ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer1.org3.com/msp/config.yaml
    
    echo "###########################################"
    echo "### Generate the peer1-tls certificates ###"
    echo "###########################################"
    fabric-ca-client enroll -u https://peer1.org3.com:peer1.org3.com_pw@localhost:10060 --caname ca.org3.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer1.org3.com/tls --enrollment.profile tls --csr.hosts peer1.org3.com --csr.hosts localhost --tls.certfiles ${PWD}/artifact/fabric-ca/org3/tls-cert.pem
    
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer1.org3.com/tls/tlscacerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer1.org3.com/tls/ca.crt
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer1.org3.com/tls/signcerts/* ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer1.org3.com/tls/server.crt
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer1.org3.com/tls/keystore/* ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer1.org3.com/tls/server.key

    echo "#############################"
    echo "### Generate the user msp ###"
    echo "#############################"
    fabric-ca-client enroll -u https://peeru.org3.com:peeru.org3.com_pw@localhost:10060 --caname ca.org3.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/users/User1@org3.com/msp --tls.certfiles ${PWD}/artifact/fabric-ca/org3/tls-cert.pem
    
    echo "##############################"
    echo "### Generate the admin msp ###"
    echo "##############################"
    fabric-ca-client enroll -u https://peera.org3.com:peera.org3.com_pw@localhost:10060 --caname ca.org3.com -M ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/users/Admin@org3.com/msp --tls.certfiles ${PWD}/artifact/fabric-ca/org3/tls-cert.pem
    cp ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/msp/config.yaml ${PWD}/artifact/crypto-config/peerOrganizations/org3.com/users/Admin@org3.com/msp/config.yaml
}

# [2] 시스템 Genesis 블록, 채널 구성 트랜잭션, 그리고 각 조직의 앵커 피어 업데이트를 생성
function CreateSystemArtifact(){
    echo "########################################"
    echo "### Generating system genesis block ###"
    echo "########################################"
    configtxgen -profile ThreeOrgsOrdererGenesis -outputBlock ./artifact/block_tx/genesis.block -channelID $SYS_CHANNEL

    echo "####################################################"
    echo "### Generating channel configuration transaction ###"
    echo "####################################################"
    configtxgen -profile ThreeOrgsChannel -outputCreateChannelTx ./artifact/block_tx/$CHANNEL_NAME.tx -channelID $CHANNEL_NAME

    echo "######################################################"
    echo "### Generating anchor peer update for peeorrg1MSP ####"
    echo "######################################################"
    configtxgen -profile ThreeOrgsChannel -outputAnchorPeersUpdate ./artifact/block_tx/org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg org1

    echo "#####################################################"
    echo "### Generating anchor peer update for peerorg2MSP ###"
    echo "#####################################################"
    configtxgen -profile ThreeOrgsChannel -outputAnchorPeersUpdate ./artifact/block_tx/org2MSPanchors.tx -channelID $CHANNEL_NAME -asOrg org2

    echo "#####################################################"
    echo "### Generating anchor peer update for peerorg3MSP ###"
    echo "#####################################################"
    configtxgen -profile ThreeOrgsChannel -outputAnchorPeersUpdate ./artifact/block_tx/org3MSPanchors.tx -channelID $CHANNEL_NAME -asOrg org3
}

# [3] 가상에서 노드 구성을 위한 도커 컨테이너 실행
function RunComponent(){
  echo "###################################"
  echo "### Running docker orderer node ###"
  echo "###################################"
  docker-compose -f ./docker-compose/docker-compose-orderer.yaml up -d orderer0.ordererorg.com orderer1.ordererorg.com orderer2.ordererorg.com
  
  echo "###############################################"
  echo "### Running docker peer node & each couchDB ###"
  echo "###############################################"
  docker-compose -f ./docker-compose/docker-compose-peer.yaml up -d couchdb0.org1.com couchdb1.org1.com couchdb0.org2.com couchdb1.org2.com couchdb0.org3.com couchdb1.org3.com peer0.org1.com peer1.org1.com peer0.org2.com peer1.org2.com peer0.org3.com peer1.org3.com
  sleep 3
}

# [4] [2]에서 만들어진 아티팩트를 이용해서 채널을 생성
#  (*) 자동화 및 테스트
function SetChannel(){
  CreateChannel
  JoinChannel
  UpdateAnchorPeer
}
#  (1) 모든조직의 각 피어에 대한 공통 및 개별 환경 변수 지정
function SetGlobalPeer {
  export CORE_PEER_TLS_ENABLED=true
  export ORDERER_CA=${PWD}/artifact/crypto-config/ordererOrganizations/ordererorg.com/orderers/orderer0.ordererorg.com/tls/ca.crt
  export PEER0_ORG1_CA=${PWD}/artifact/crypto-config/peerOrganizations/org1.com/peers/peer0.org1.com/tls/ca.crt
  export PEER0_ORG2_CA=${PWD}/artifact/crypto-config/peerOrganizations/org2.com/peers/peer0.org2.com/tls/ca.crt
  export PEER0_ORG3_CA=${PWD}/artifact/crypto-config/peerOrganizations/org3.com/peers/peer0.org3.com/tls/ca.crt
  export FABRIC_CFG_PATH=${PWD}/config/
}
function SetGlobalP0O1 {
  export CORE_PEER_LOCALMSPID="org1MSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
  export CORE_PEER_MSPCONFIGPATH=${PWD}/artifact/crypto-config/peerOrganizations/org1.com/users/Admin@org1.com/msp
  export CORE_PEER_ADDRESS=localhost:8051
}
function SetGlobalP1O1 {
  export CORE_PEER_LOCALMSPID="org1MSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG1_CA
  export CORE_PEER_MSPCONFIGPATH=${PWD}/artifact/crypto-config/peerOrganizations/org1.com/users/Admin@org1.com/msp
  export CORE_PEER_ADDRESS=localhost:8052
}
function SetGlobalP0O2 {
  export CORE_PEER_LOCALMSPID="org2MSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG2_CA
  export CORE_PEER_MSPCONFIGPATH=${PWD}/artifact/crypto-config/peerOrganizations/org2.com/users/Admin@org2.com/msp
  export CORE_PEER_ADDRESS=localhost:9051
}
function SetGlobalP1O2 {
  export CORE_PEER_LOCALMSPID="org2MSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG2_CA
  export CORE_PEER_MSPCONFIGPATH=${PWD}/artifact/crypto-config/peerOrganizations/org2.com/users/Admin@org2.com/msp
  export CORE_PEER_ADDRESS=localhost:9052
}
function SetGlobalP0O3 {
  export CORE_PEER_LOCALMSPID="org3MSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG3_CA
  export CORE_PEER_MSPCONFIGPATH=${PWD}/artifact/crypto-config/peerOrganizations/org3.com/users/Admin@org3.com/msp
  export CORE_PEER_ADDRESS=localhost:10051
}
function SetGlobalP1O3 {
  export CORE_PEER_LOCALMSPID="org3MSP"
  export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG3_CA
  export CORE_PEER_MSPCONFIGPATH=${PWD}/artifact/crypto-config/peerOrganizations/org3.com/users/Admin@org3.com/msp
  export CORE_PEER_ADDRESS=localhost:10052
}

#  (2) 채널 구성 트랜잭션 파일을 사용해 채널 생성
function CreateChannel {
  echo "######################"
  echo "### Create channel ###"
  echo "######################"
  SetGlobalPeer
  SetGlobalP0O1
  peer channel create -o localhost:7051 -c $CHANNEL_NAME \
  --ordererTLSHostnameOverride orderer0.ordererorg.com \
  -f ./artifact/block_tx/${CHANNEL_NAME}.tx --outputBlock ./artifact/block_tx/${CHANNEL_NAME}.block \
  --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
  sleep 9
}

#  (3) 모든 피어를 채널에 가입
function JoinChannel {
  echo "##################################"
  echo "### Join all peer to a channel ###"
  echo "##################################"
  SetGlobalP0O1
  peer channel join -b ./artifact/block_tx/$CHANNEL_NAME.block
  SetGlobalP1O1
  peer channel join -b ./artifact/block_tx/$CHANNEL_NAME.block
  SetGlobalP0O2
  peer channel join -b ./artifact/block_tx/$CHANNEL_NAME.block
  SetGlobalP1O2
  peer channel join -b ./artifact/block_tx/$CHANNEL_NAME.block
  SetGlobalP0O3
  peer channel join -b ./artifact/block_tx/$CHANNEL_NAME.block
  SetGlobalP1O3
  peer channel join -b ./artifact/block_tx/$CHANNEL_NAME.block
  sleep 3
}

#  (4) orderer에게 채널의 각 조직에 대한 앵커 피어 업데이트
function UpdateAnchorPeer {
  echo "#######################################"
  echo "### Update anchor peer to a channel ###"
  echo "#######################################"
  SetGlobalP0O1
  peer channel update -o localhost:7051 --ordererTLSHostnameOverride orderer0.ordererorg.com -c $CHANNEL_NAME -f ./artifact/block_tx/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
  SetGlobalP0O2
  peer channel update -o localhost:7051 --ordererTLSHostnameOverride orderer0.ordererorg.com -c $CHANNEL_NAME -f ./artifact/block_tx/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
  SetGlobalP0O3
  peer channel update -o localhost:7051 --ordererTLSHostnameOverride orderer0.ordererorg.com -c $CHANNEL_NAME -f ./artifact/block_tx/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
}

# [5] 체인 코드 배포
#  (*) 자동화 및 테스트
function DeployCC() {
  PackageCC
  InstallCC
  ApproveCC
  CommitCC
}

#  (1) 체인 코드 배포 관련 공통환경변수 지정
function SetGlobalCC {
  SetGlobalPeer
  export GOROOT=/usr/local/go
  export GOPATH=$HOME/go
  export PATH=$PATH:$GOROOT/bin:$GOPATH/bin:$GOPATH/src/fabir-samples/bin
  export CC_RUNTIME_LANGUAGE="golang"
  export VERSION="1"
  export CC_SRC_PATH="./chaincode/did"
  export CC_NAME="did" 
}

#  (2) 체인 코드 패키징
function PackageCC {
  echo "#################################################"
  echo "### PackageCC - Chaincode is packaged on p0o1 ###"
  echo "#################################################"  
  SetGlobalCC
  SetGlobalP0O1
  peer lifecycle chaincode package ./chaincode/did/${CC_NAME}.tar.gz --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} --label ${CC_NAME}_${VERSION}

  sleep 3
}

#  (3) 체인 코드 설치
function InstallCC {
  SetGlobalCC

  echo "##################################################"
  echo "### InstallCC - Chaincode is installed on p0o1 ###"
  echo "##################################################"  
  SetGlobalP0O1
  peer lifecycle chaincode install ./chaincode/did/${CC_NAME}.tar.gz 

  echo "##################################################"
  echo "### InstallCC - Chaincode is installed on p0o2 ###"
  echo "##################################################"  
  SetGlobalP0O2
  peer lifecycle chaincode install ./chaincode/did/${CC_NAME}.tar.gz 

  echo "##################################################"
  echo "### InstallCC - Chaincode is installed on p0o3 ###"
  echo "##################################################"  
  SetGlobalP0O3
  peer lifecycle chaincode install ./chaincode/did/${CC_NAME}.tar.gz 

  echo "#####################################################"
  echo "### Query installed successful on p0o1 on channel ###"
  echo "#####################################################"
  SetGlobalP0O1
  peer lifecycle chaincode queryinstalled >&./chaincode/did/log.txt
  cat ./chaincode/did/log.txt
  export PACKAGE_ID=$(sed -n "/${CC_NAME}_${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" ./chaincode/did/log.txt)
  echo PackageID is ${PACKAGE_ID}

  sleep 3
}

#  (4) 체인 코드를 조직별로 승인하는 작업 수행
function ApproveCC {
  SetGlobalCC
  export PACKAGE_ID=$(sed -n "/${CC_NAME}_${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" ./chaincode/did/log.txt)

  echo "################################################"
  echo "### ApproveCC - Chaincode approved from org1 ###"
  echo "################################################"
  SetGlobalP0O1
  peer lifecycle chaincode approveformyorg -o localhost:7051 \
    --ordererTLSHostnameOverride orderer0.ordererorg.com --tls \
    --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
    --init-required --package-id ${PACKAGE_ID} \
    --sequence ${VERSION}

  echo "##################################################"
  echo "### ApproveCC - Checking commit org1 readyness ###"
  echo "##################################################"
  peer lifecycle chaincode checkcommitreadiness \
    --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
    --sequence ${VERSION} --output json --init-required

  echo "################################################"
  echo "### ApproveCC - Chaincode approved from org2 ###"
  echo "################################################"
  SetGlobalP0O2
  peer lifecycle chaincode approveformyorg -o localhost:7051 \
    --ordererTLSHostnameOverride orderer0.ordererorg.com --tls $CORE_PEER_TLS_ENABLED \
    --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} \
    --version ${VERSION} --init-required --package-id ${PACKAGE_ID} \
    --sequence ${VERSION}
  
  echo "##################################################"
  echo "### ApproveCC - Checking commit org2 readyness ###"
  echo "##################################################"
  peer lifecycle chaincode checkcommitreadiness \
    --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
    --sequence ${VERSION} --output json --init-required

  echo "################################################"
  echo "### ApproveCC - Chaincode approved from org3 ###"
  echo "################################################"
  SetGlobalP0O3
  peer lifecycle chaincode approveformyorg -o localhost:7051 \
    --ordererTLSHostnameOverride orderer0.ordererorg.com --tls $CORE_PEER_TLS_ENABLED \
    --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} \
    --version ${VERSION} --init-required --package-id ${PACKAGE_ID} \
    --sequence ${VERSION}

  echo "##################################################"
  echo "### ApproveCC - Checking commit org3 readyness ###"
  echo "##################################################"
  peer lifecycle chaincode checkcommitreadiness \
    --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
    --sequence ${VERSION} --output json --init-required
  
  sleep 3
}

#  (5) 체인 코드 활성화
function CommitCC {
  echo "###########################################"
  echo "### CommitCC - Chaincode commit orderer ###"
  echo "###########################################"
  SetGlobalCC
  peer lifecycle chaincode commit -o localhost:7051 --ordererTLSHostnameOverride orderer0.ordererorg.com \
  --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
  --channelID $CHANNEL_NAME --name ${CC_NAME} \
  --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_ORG1_CA \
  --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
  --peerAddresses localhost:10051 --tlsRootCertFiles $PEER0_ORG3_CA \
  --version ${VERSION} --sequence ${VERSION} --init-required

  echo "########################################"
  echo "### CommitCC - Chaincode commit org1 ###"
  echo "########################################"
  SetGlobalP0O1
  peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME}
  
  echo "########################################"
  echo "### CommitCC - Chaincode commit org2 ###"
  echo "########################################"
  SetGlobalP0O2
  peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME}

  echo "########################################"
  echo "### CommitCC - Chaincode commit org3 ###"
  echo "########################################"
  SetGlobalP0O3
  peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME}

  sleep 3
}

# [6] 체인 코드 기능 테스트
function TestCC(){
  SetGlobalCC
  SetGlobalP0O1
  
  # InitLedger
  echo "#################################"
  echo "### TestCC -Init ledger(p0o1) ###"
  echo "#################################"
  peer chaincode invoke -o localhost:7051 \
    --ordererTLSHostnameOverride orderer0.ordererorg.com \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
    -C $CHANNEL_NAME -n ${CC_NAME} \
    --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_ORG1_CA \
    --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
    --peerAddresses localhost:10051 --tlsRootCertFiles $PEER0_ORG3_CA \
    --isInit -c '{"Args":["InitLedger"]}'
  sleep 3
  
  # CreateDID
  echo "###################################################"
  echo "### TestCC - Create DID in ledger(p0o1) ###"
  echo "###################################################"
  peer chaincode invoke -o localhost:7051 \
    --ordererTLSHostnameOverride orderer0.ordererorg.com \
    --tls $CORE_PEER_TLS_ENABLED \
    --cafile $ORDERER_CA \
    -C $CHANNEL_NAME -n ${CC_NAME} \
    --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_ORG1_CA \
    --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
    --peerAddresses localhost:10051 --tlsRootCertFiles $PEER0_ORG3_CA \
    -c '{"Args":["CreateDID",
    "did:example:123456789abcdefghz",
    "https://www.w3.org/ns/did/v1",
    "[{\"id\":\"did:example:123456789abcdefghz#keys-1\",\"type\":\"RsaVerificationKey2018\",\"controller\":\"did:example:123456789abcdefghz\",\"publicKeyPem\":\"-----BEGIN PUBLIC KEY-----\\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDF8gTYtVcU0S2ma7KROZ/LGhfh\\nf0npf/qVz4IT0D6oKdECDbSJfckMQW7fWxWmscc4zPvzauXlMLd1FgsXn6vgq0yo\\nsOGABVrUkTAMs2zPDLslIrARf8RcbpMqP+1aLl7n4pUq02ZzN7GChRh3jv4gAlRV\\nzDjMY2Cp1JQ1InaHuwIDAQAB\\n-----END PUBLIC KEY-----\\n\"}]",
    "[\"did:example:123456789abcdefghz#auth-1\",\"did:example:123456789abcdefghz#auth-2\"]",
    "[{\"id\":\"did:hlf:didissuer\",\"type\":\"DID Issuer\",\"serviceEndpoint\":\"https://didissuer.com\"}]"]}'
  sleep 3
  
  echo "################################################"
  echo "### TestCC - Get DID in ledger(p0o1) ###"
  echo "################################################"
  peer chaincode invoke -o localhost:7051 \
    --ordererTLSHostnameOverride orderer0.ordererorg.com \
    --tls $CORE_PEER_TLS_ENABLED \
    --cafile $ORDERER_CA \
    -C $CHANNEL_NAME -n ${CC_NAME} \
    --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_ORG1_CA \
    --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
    --peerAddresses localhost:10051 --tlsRootCertFiles $PEER0_ORG3_CA \
    -c '{"Args":["GetDID","did:example:123456789abcdefghz"]}'
  sleep 3
  
  echo "###################################################"
  echo "### TestCC - Update DID in ledger(p0o1) ###"
  echo "###################################################"
  peer chaincode invoke -o localhost:7051 \
    --ordererTLSHostnameOverride orderer0.ordererorg.com \
    --tls $CORE_PEER_TLS_ENABLED \
    --cafile $ORDERER_CA \
    -C $CHANNEL_NAME -n ${CC_NAME} \
    --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_ORG1_CA \
    --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
    --peerAddresses localhost:10051 --tlsRootCertFiles $PEER0_ORG3_CA \
    -c '{"Args":["UpdateDID",
    "did:example:123456789abcdefghz",
    "https://www.w3.org/ns/did/v1",
    "[{\"id\":\"did:example:123456789abcdefghz#keys-2\",\"type\":\"RsaVerificationKey2018\",\"controller\":\"did:example:123456789abcdefghz\",\"publicKePem\":\"-----BEGIN PUBLIC KEY-----\\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDF8gTYtVcU0S2ma7KROZ/LGhfh\\nf0npf/qVz4IT0D6oKdECDbSJfckMQW7fWxWmscc4zPvzauXlMLd1FgsXn6vgq0yo\\nsOGABVrUkTAMs2zPDLslIrARf8RcbpMqP+1aLl7n4pUq02ZzN7GChRh3jv4gAlRV\\nzDjMY2Cp1JQ1InaHuwIDAQAB\\n-----END PUBLIC KEY-----\\n\"}]",
    "[\"did:example:123456789abcdefghz#auth-1\",\"did:example:123456789abcdefghz#auth-3\"]",
    "[{\"id\":\"did:hlf:didissuer\",\"type\":\"DID Issuer\",\"serviceEndpoint\":\"https://didissuer.com\"}]"]}'
    sleep 3
  
  echo "################################################"
  echo "### TestCC - Get DID in ledger(p0o1) ###"
  echo "################################################"
  peer chaincode invoke -o localhost:7051 \
    --ordererTLSHostnameOverride orderer0.ordererorg.com \
    --tls $CORE_PEER_TLS_ENABLED \
    --cafile $ORDERER_CA \
    -C $CHANNEL_NAME -n ${CC_NAME} \
    --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_ORG1_CA \
    --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
    --peerAddresses localhost:10051 --tlsRootCertFiles $PEER0_ORG3_CA \
    -c '{"Args":["GetDID","did:example:123456789abcdefghz"]}'
  sleep 3
  
  # DeleteDID
  echo "###################################################"
  echo "### TestCC - Delete DID in ledger(p0o1) ###"
  echo "###################################################"
  peer chaincode invoke -o localhost:7051 \
    --ordererTLSHostnameOverride orderer0.ordererorg.com \
    --tls $CORE_PEER_TLS_ENABLED \
    --cafile $ORDERER_CA \
    -C $CHANNEL_NAME -n ${CC_NAME} \
    --peerAddresses localhost:8051 --tlsRootCertFiles $PEER0_ORG1_CA \
    --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_ORG2_CA \
    --peerAddresses localhost:10051 --tlsRootCertFiles $PEER0_ORG3_CA \
    -c '{"Args":["DeleteDID","did:example:123456789abcdefghz"]}'
  sleep 3
}

# [7] 초기화
function ResetNetwork(){
  echo "############################"
  echo "### Reset Fabric Network ###"
  echo "############################"
  set -e
  sudo rm -rf ./artifact/fabric-ca/* ./artifact/crypto-config/* ./artifact/block_tx/* || true;
  sudo rm -rf ./chaincode/did/did.tar.gz ./chaincode/did/log.txt || true;
  docker stop $(docker ps -a -q) || true;
  docker rm $(docker ps -a -q) || true;
  docker rmi $(docker images dev-* -q) || true;
  docker-compose -f ./docker-compose/docker-compose-ca.yaml kill || true
  docker-compose -f ./docker-compose/docker-compose-ca.yaml down || true
  docker-compose -f ./docker-compose/docker-compose-orderer.yaml kill || true
  docker-compose -f ./docker-compose/docker-compose-orderer.yaml down || true
  docker-compose -f ./docker-compose/docker-compose-peer.yaml kill || true
  docker-compose -f ./docker-compose/docker-compose-peer.yaml down || true
  docker network prune -f || true;
  docker images || true;
  docker ps || true;
  docker network ls || true;
}

# [*] 쉘 모드 설정
if [[ $# -lt 1 ]] ; then
    exit 0
else
  MODE=$1
  shift
fi
if [ "$MODE" == "start" ]; then
  Start  
elif [ "$MODE" == "createmspall" ]; then
  CreateMspAll
elif [ "$MODE" == "createsystemartifact" ]; then
  CreateSystemArtifact
elif [ "$MODE" == "runcomponent" ]; then
  RunComponent
elif [ "$MODE" == "setchannel" ]; then
  SetChannel
elif [ "$MODE" == "deploycc" ]; then
  DeployCC
elif [ "$MODE" == "testcc" ]; then
  TestCC
elif [ "$MODE" == "reset" ]; then
  ResetNetwork
else
  exit 1
fi