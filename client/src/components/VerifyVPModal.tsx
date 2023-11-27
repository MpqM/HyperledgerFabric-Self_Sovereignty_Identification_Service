import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { DIDAuthResponse, DIDAuthResult, DIDAuthSignature, VPJson, VerifyVPResult } from "../network/Interface";
import * as SSIapi from "../network/SSIapi";

interface VerifyVPModalProps {
  getVerifyVPResult: (verifyVPResult: VerifyVPResult | null) => void;
}

const VerifyVPModal = ({getVerifyVPResult}: VerifyVPModalProps) => {
  const [show, setShow] = useState(false);
  const [vpJson, setVPJson] = useState<VPJson>(JSON.parse(localStorage.getItem("vVPJson") || '{}'));
  const [success, setSuccess] = useState("")

  const onSubmit = async () => {
    
    try {
      const response = await SSIapi.verifyVP(vpJson);
      getVerifyVPResult(response)
      setShow(false);
    } catch (error) { console.log(error); }
  };

  return (
    <>
      <Button variant="dark" onClick={() => setShow(true)}>VerifyVP</Button>
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>VerifyVP</Modal.Title></Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={onSubmit}>Verify</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default VerifyVPModal;
