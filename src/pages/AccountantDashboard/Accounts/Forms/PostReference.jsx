import React, { useState } from "react";
import { Container, Form, Button, Modal } from "react-bootstrap";
import styles from "./AccountForm.module.css";
import modalBodyStyles from "./ModalBody.module.css";
import {
  approveJournal,
  rejectJournal,
} from "../../../../services/JournalService";

const PostReference = ({
  entry,
  matchedJournal,
  onClose,
  handleUpdateJournalEntries,
}) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showModal, setShowModal] = useState(true);

  const handleApprove = async () => {
    try {
      await approveJournal(matchedJournal.journalId, "APPROVED");
      const updatedJournalEntries = matchedJournal.journalEntries.map(
        (journalEntry) =>
          journalEntry.journalEntryId === entry.journalEntryId
            ? { ...journalEntry, status: "approved" }
            : journalEntry
      );
      handleUpdateJournalEntries(updatedJournalEntries);
      setShowModal(false);
      onClose();
    } catch (error) {
      console.error("Failed to approve journal entry:", error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectJournal(matchedJournal.journalId, rejectionReason);
      const updatedJournalEntries = matchedJournal.journalEntries.map(
        (journalEntry) =>
          journalEntry.journalEntryId === entry.journalEntryId
            ? { ...journalEntry, status: "rejected", rejectionReason }
            : journalEntry
      );
      handleUpdateJournalEntries(updatedJournalEntries);
      setShowModal(false);
      onClose();
    } catch (error) {
      console.error("Failed to reject journal entry:", error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    onClose();
  };

  const handleDownloadAttachment = (attachedFile) => {
    const fileName = `attachment.${
      matchedJournal.attachedFileContentType.split("/")[1]
    }`;

    const binaryData = atob(attachedFile);
    const byteNumbers = new Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      byteNumbers[i] = binaryData.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], {
      type: matchedJournal.attachedFileContentType,
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();

    return `${year}, ${month} ${day}`;
  };

  return (
    <Modal
      show={showModal}
      onHide={handleCancel}
      centered
      className={styles.customModal}
      dialogClassName={styles.customModalDialog}
    >
      <Modal.Header closeButton>
        <Modal.Title>Post Reference</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={modalBodyStyles.wideModalBody}>
          <Container>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Account</th>
                  <th>Debit</th>
                  <th>Credit</th>
                </tr>
              </thead>
              <tbody>
                {matchedJournal.journalEntries.map((journalEntry) => (
                  <tr key={journalEntry.journalEntryId}>
                    <td>{formatDate(matchedJournal.transactionDate)}</td>
                    <td>{journalEntry.account.accountName}</td>
                    <td>${journalEntry.debit.toFixed(2)}</td>
                    <td>${journalEntry.credit.toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <th>Description</th>
                  <td colSpan="4">{entry.description}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td colSpan="4">{matchedJournal.status}</td>
                </tr>
              </tbody>
            </table>
            <React.Fragment>
              {matchedJournal.status === "PENDING" ? (
                <Form.Group controlId="rejectionReason">
                  <Form.Label>Rejection Reason</Form.Label>
                  <Form.Control
                    type="text"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </Form.Group>
              ) : null}
            </React.Fragment>
            <React.Fragment>
              {matchedJournal.attachedFile ? (
                <div>
                  <h5>Attachment:</h5>
                  <button
                    onClick={() =>
                      handleDownloadAttachment(matchedJournal.attachedFile)
                    }
                  >
                    Download Attachment
                  </button>
                </div>
              ) : (
                <div>
                  <h5>No Attachment</h5>
                </div>
              )}
            </React.Fragment>
          </Container>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PostReference;
