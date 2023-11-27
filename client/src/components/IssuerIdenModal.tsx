import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { DIDJson, IIden, IUniv } from "../network/Interface";
import * as SSIapi from "../network/SSIapi";

const IssuerIdenModal = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");

    const onSubmit = async () => {
        try {
            const iIdenInput: IIden = {
                name: name,
                age: age,
                gender: gender,
                address: address,
            }
            const iIden = await SSIapi.createIIden(iIdenInput)
            setShow(false);
        } catch (error) { console.log(error) }
    }

    return (
        <>
            <Button variant="dark" onClick={() => setShow(true)}> CreateIden </Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton><Modal.Title> CreateIden </Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Control
                            className="mb-3"
                            type="text"
                            placeholder="name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Form.Control
                            className="mb-3"
                            type="text"
                            placeholder="age"
                            autoFocus
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                        <Form.Group className="d-flex mb-3">
                            <Form.Check
                                className="me-3"
                                type="radio"
                                label="Male"
                                value="male"
                                checked={gender === 'male'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                            <Form.Check
                                type="radio"
                                label="Female"
                                value="female"
                                checked={gender === 'female'}
                                onChange={(e) => setGender(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="address"
                            autoFocus
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {name && age && gender && address && (<Button variant="secondary" onClick={onSubmit}> Submit </Button>)}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default IssuerIdenModal