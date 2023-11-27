import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { DIDJson } from "../network/Interface";
import * as SSIapi from "../network/SSIapi";

interface GetDIDModalProps { getDIDJson: (didJson: DIDJson | null) => void; }

const GetDIDModal = ({ getDIDJson }: GetDIDModalProps) => {
  const [show, setShow] = useState(false);
  const [didId, setDIDId] = useState("");

  const onSubmit = async () => {
    try {
      const didJson = await SSIapi.getDID(didId);
      setShow(false);
      getDIDJson(didJson);
    } catch (error) { console.log(error); }
  };

  return (
    <>
      <Button variant="dark" onClick={() => setShow(true)}>GetDID</Button>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>GetDID</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control
              type="text"
              placeholder="your DID id"
              autoFocus
              value={didId}
              onChange={(e) => setDIDId(e.target.value)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {didId && <Button variant="secondary" onClick={onSubmit}>Submit</Button>}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GetDIDModal;
