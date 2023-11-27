import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { DIDJson, VPJson } from "../network/Interface";
import * as SSIapi from "../network/SSIapi";

const InPutVPModal = () => {
  const [show, setShow] = useState(false);
  const [InputVCJson, setInputVpJson] = useState("");

  const onSubmit = async () => {
    try {
      const vpJsonData:VPJson = JSON.parse(InputVCJson)
      console.log(vpJsonData)
      setShow(false);
      localStorage.setItem('vVPJson', JSON.stringify(vpJsonData))
    } catch (error) { console.log(error); }
  };

  return (
    <>
      <Button variant="dark" onClick={() => setShow(true)}>InputVP</Button>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton><Modal.Title>InputVP</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Control
              type="text"
              as="textarea"
              rows={20}
              placeholder="your vp"
              autoFocus
              value={InputVCJson}
              onChange={(e) => setInputVpJson(e.target.value)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {InputVCJson && <Button variant="secondary" onClick={onSubmit}>Submit</Button>}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InPutVPModal;