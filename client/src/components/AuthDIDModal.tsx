import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { DIDAuthResponse, DIDAuthResult, DIDAuthSignature } from "../network/Interface";
import * as SSIapi from "../network/SSIapi";

interface AuthDIDModalProps {
  getDIDAuthResult: (didAuthVerifyResult: DIDAuthResult | null) => void;
  roleAuth: { req: string; res: string };
}

const AuthDIDModal = ({ roleAuth, getDIDAuthResult }: AuthDIDModalProps) => {
  const [show, setShow] = useState(false);
  const [challenge, setChallenge] = useState("");
  const [signature, setSignature] = useState("");
  const [didId, setDIDId] = useState("");
  const [privateKeyPem, setPrivateKeyPem] = useState("");

  useEffect(() => {
    if (show) {
      const authDIDChallenge = async () => {
        try {
          const challenge = await SSIapi.authDIDChallenge(roleAuth.req);
          setChallenge(challenge);
        } catch (error) { console.log(error); }
      };
      authDIDChallenge();
    }
  }, [show]);

  const onSign = async () => {
    const didAuthSignature: DIDAuthSignature = { challenge: challenge, privateKeyPem: privateKeyPem.replace(/\\n/g, "\n") };
    try {
      const signature = await SSIapi.authDIDSignature(roleAuth.res, didAuthSignature);
      setSignature(signature);
    } catch (error) { console.log(error); }
  };

  const onSubmit = async () => {
    const didAuthResponse: DIDAuthResponse = { challenge: challenge, id: didId, signature: signature, };
    try {
      const response = await SSIapi.authDIDResponse(roleAuth.req, didAuthResponse);
      const didAuthResult: DIDAuthResult = { challenge: challenge, signature: signature, privateKeyPem: privateKeyPem, response: response };
      setShow(false);
      getDIDAuthResult(didAuthResult);
    } catch (error) { console.log(error); }
  };

  return (
    <>
      <Button variant="dark" onClick={() => setShow(true)}>AuthDID</Button>
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>AuthDID</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label className="mb-3">Challenge: {challenge}</Form.Label>
            <Form.Control
              className="mb-3"
              type="text"
              placeholder="your DID id"
              autoFocus
              value={didId}
              onChange={(e) => setDIDId(e.target.value)}
            />
            <Form.Control
              type="text"
              as="textarea"
              rows={10}
              placeholder="your privateKeyPem"
              autoFocus
              value={privateKeyPem}
              onChange={(e) => setPrivateKeyPem(e.target.value)}
            />
            {signature && <pre>Signatrue: {signature}</pre>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {(challenge && didId && privateKeyPem) && (<Button variant="secondary" onClick={onSign}>Sign</Button>)}
          {signature && <Button variant="secondary" onClick={onSubmit}>Submit</Button>}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AuthDIDModal;
