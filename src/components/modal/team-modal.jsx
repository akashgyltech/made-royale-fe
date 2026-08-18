import React from "react";
import Modal from "react-bootstrap/Modal";
import TeamDetailsArea from "../team/team-details-area";
export default function TeamModal({ showModal, setShowModal, teamItem }) {
    const handleClose = () => setShowModal(false);
    return (<Modal show={showModal} onHide={handleClose} style={{
            backgroundImage: `url(/assets/img/home-01/team/team-details-bg.png)`,
        }}>
      <Modal.Header closeButton>
        <button type="button" className="btn-close"></button>
      </Modal.Header>
      <Modal.Body>
        <TeamDetailsArea id={1}/>
      </Modal.Body>
    </Modal>);
}
