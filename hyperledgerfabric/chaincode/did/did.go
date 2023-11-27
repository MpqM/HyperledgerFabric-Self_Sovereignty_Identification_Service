package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract는 스마트 계약 구조체
type SmartContract struct {
	contractapi.Contract
}

// DIDDocument는 Decentralized Identifier(DID) 문서를 나타내는 구조체
type DID struct {
    Context   string      `json:"context"`
    ID        string      `json:"id"`         // DID 문서의 식별자
    PublicKey []PublicKey `json:"publicKey"`  // 공개 키 목록
    Auth      []string      `json:"auth"`       // 인증 정보 목록
    Service   []Service   `json:"service"`    // 서비스 정보 목록
}

// PublicKey는 공개 키를 나타내는 구조체
type PublicKey struct {
	ID           string `json:"id"`           // 공개 키의 식별자
	Type         string `json:"type"`         // 공개 키의 유형
	Controller   string `json:"controller"`   // 공개 키의 컨트롤러
	PublicKeyPem string `json:"publicKeyPem"` // 공개 키의 PEM 형식 문자열
}

type Service struct {
	ID string `json:"id"`
	Type string `json:"type"`
	ServiceEndpoint string `json:"serviceEndpoint"`
}

// InitLedger는 초기화 함수로, 체인코드를 실행할 때 최초로 호출되며 임의의 DID 문서를 생성해 원장에 저장
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	dids := []DID{
		{
			Context: "https://www.w3.org/ns/did/v1",
			ID: "did:hlf:pjsdiddoc",
			PublicKey: []PublicKey{
				{
					ID:           "did:hlf:pjsdid1234#keys-1",
					Type:         "RsaVerificationKey2018",
					Controller:   "did:hlf:pjsdid1234",
					PublicKeyPem: "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDF8gTYtVcU0S2ma7KROZ/LGhfh\nf0npf/qVz4IT0D6oKdECDbSJfckMQW7fWxWmscc4zPvzauXlMLd1FgsXn6vgq0yo\nsOGABVrUkTAMs2zPDLslIrARf8RcbpMqP+1aLl7n4pUq02ZzN7GChRh3jv4gAlRV\nzDjMY2Cp1JQ1InaHuwIDAQAB\n-----END PUBLIC KEY-----\n",
				},
			},
			Auth: []string{
						"did:hlf:pjsdid1234#keys-1",
						"did:hlf:pjsdid1234#keys-2",
			},
			Service: []Service{
				{
					ID: "did:hlf:didissuer",
					Type: "DID Issuer",
					ServiceEndpoint: "https://didissuer.com",
				},
			},
		},
	}

	// 원장에 각 DID 문서를 저장
	for _, did := range dids {
		didJSON, err := json.Marshal(did)
		if err != nil { return fmt.Errorf("failed to marshal DID: %v", err) }
		err = ctx.GetStub().PutState(did.ID, didJSON)
		if err != nil { return fmt.Errorf("failed to put DID on ledger: %v", err) }
	}

	return nil
}

// CreateDIDDocument는 각 구조체의 데이터를 받아 DID 문서를 생성해 원장에 저장하는 함수
func (s *SmartContract) CreateDID(ctx contractapi.TransactionContextInterface, id string, context string, publicKey []PublicKey, auth []string, service []Service) (*DID, error) {
	existingDidJSON, err := ctx.GetStub().GetState(id)
	if existingDidJSON != nil {return nil, fmt.Errorf("DID with the same id exists.")}
	if err != nil { return nil, fmt.Errorf("failed to read DID from ledger: %v", err) }
	
	did := DID{
		Context:   context,
		ID:        id,
		PublicKey: publicKey,
		Auth:      auth,
		Service:   service,
	}

	didJSON, err := json.Marshal(did)
	if err != nil { return nil, fmt.Errorf("failed to marshal DID: %v", err) }

	err = ctx.GetStub().PutState(did.ID, didJSON)
	if err != nil { return nil, fmt.Errorf("failed to put DID on ledger: %v", err) }

	return &did, nil
}

// GetDIDDoc는 주어진 식별자에 해당하는 DID 문서를 조회하는 함수
func (s *SmartContract) GetDID(ctx contractapi.TransactionContextInterface, id string) (*DID, error) {
	didJSON, err := ctx.GetStub().GetState(id)
	if err != nil { return nil, fmt.Errorf("failed to read DID from ledger: %v", err) }
	if didJSON == nil { return nil, fmt.Errorf("DID not found on ledger") }

	var did DID
	err = json.Unmarshal(didJSON, &did)
	if err != nil { return nil, fmt.Errorf("failed to unmarshal DID: %v", err)}
	
	return &did, nil
}

// UpdateDIDDoc는 주어진 식별자에 해당하는 DID 문서를 업데이트하는 (덮어쓰는) 함수
func (s *SmartContract) UpdateDID(ctx contractapi.TransactionContextInterface, id string, context string, publicKey []PublicKey, auth []string, service []Service) (*DID, error) {
	existingDidJSON, err := ctx.GetStub().GetState(id)
	if err != nil { return nil, fmt.Errorf("failed to read existing DID from ledger: %v", err) }
	if existingDidJSON == nil { return nil, fmt.Errorf("DID not found on ledger") }

	var existingDid DID
	err = json.Unmarshal(existingDidJSON, &existingDid)
	if err != nil { return nil, fmt.Errorf("failed to unmarshal existing DID: %v", err) }

	// 기존의 DID 문서 전체 필드를 업데이트
	existingDid.Context = context
	existingDid.PublicKey = publicKey
	existingDid.Auth = auth
	existingDid.Service = service

	updatedDidJSON, err := json.Marshal(existingDid)
	if err != nil { return nil, fmt.Errorf("failed to marshal updated DID: %v", err) }

	err = ctx.GetStub().PutState(existingDid.ID, updatedDidJSON)
	if err != nil { return nil, fmt.Errorf("failed to put updated DID on ledger: %v", err) }

	return &existingDid, nil
}

// DeleteDIDDocument는 주어진 식별자에 해당하는 DID 문서를 삭제하는 함수
func (s *SmartContract) DeleteDID(ctx contractapi.TransactionContextInterface, id string) (error) {
	existingDocJSON, err := ctx.GetStub().GetState(id)
	if err != nil { return fmt.Errorf("failed to read existing DID from ledger: %v", err) }
	if existingDocJSON == nil { return fmt.Errorf("DID not found on ledger") }

	err = ctx.GetStub().DelState(id)
	if err != nil { return  fmt.Errorf("failed to delete DID from ledger: %v", err) }

	return nil
}

func main() {
	// 스마트 계약 인스턴스를 생성
	chaincode, err := contractapi.NewChaincode(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating did chaincode: %s", err.Error())
		return
	}

	// 스마트 계약을 실행
	if err := chaincode.Start(); err != nil { fmt.Printf("Error starting did chaincode: %s", err.Error()) }
}
