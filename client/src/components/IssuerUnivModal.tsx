import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { DIDJson, IUniv } from "../network/Interface";
import * as SSIapi from "../network/SSIapi";

const IssuerUnivModal = () => {
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [graduationDate, setGraduationDate] = useState("")
    const [major, setMajor] = useState("")
    const [gpa, setGpa] = useState("")

    const onSubmit = async () => {
        try {
            const iUnivInput: IUniv = {
                name: name,
                age: age,
                gender: gender,
                graduationDate: graduationDate,
                major: major,
                gpa: gpa
            }
            const iUniv = await SSIapi.createIUniv(iUnivInput)
            setShow(false);
        } catch (error) { console.log(error) }
    }

    return (
        <>
            <Button variant="dark" onClick={() => setShow(true)}> CreateUniv </Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton><Modal.Title> CreateUniv </Modal.Title></Modal.Header>
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
                            className="mb-3"
                            type="text"
                            placeholder="graduation date"
                            autoFocus
                            value={graduationDate}
                            onChange={(e) => setGraduationDate(e.target.value)}
                        />
                        <Form.Control
                            className="mb-3"
                            type="text"
                            placeholder="major"
                            autoFocus
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                        />
                        <Form.Control
                            type="text"
                            placeholder="gpa"
                            autoFocus
                            value={gpa}
                            onChange={(e) => setGpa(e.target.value)}
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                {name && age && gender && graduationDate && major && gpa && (<Button variant="secondary" onClick={onSubmit}> Submit </Button>)}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default IssuerUnivModal