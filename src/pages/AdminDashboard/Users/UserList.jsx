import React, { useEffect, useState, useContext } from "react";
import { fetchUsers } from "../../../services/UserService";
import { useNavigate } from "react-router-dom";
import styles from "../AdminDashboard.module.css";
import AppContext from "../../../../context/AppContext";
import {
  activateUser,
  deactivateUser,
  suspendUser,
} from "../../../services/UserService";
import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

const UserList = () => {
  const { state } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [userIdForActivateDeactivate, setUserIdForActivateDeactivate] =
    useState("");
  const [userIdForSuspend, setUserIdForSuspend] = useState("");
  const [suspensionStartDate, setSuspensionStartDate] = useState(null);
  const [suspensionEndDate, setSuspensionEndDate] = useState(null);
  const [email, setEmail] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  useEffect(() => {
    if (state.isLoggedIn && state.role === "admin") {
      fetchUsers()
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log(
        "Error fetching data. isLoggedIn may be false or the role may not be admin."
      );
    }
  }, [state.isLoggedIn, state.role]);

  const handleButtonClick = async (action) => {
    switch (action) {
      case "ActivateUser":
        try {
          console.log(`Activate User with ID: ${userIdForActivateDeactivate}`);
          await activateUser(userIdForActivateDeactivate);
          fetchUsers().then((response) => {
            setUsers(response.data);
          });
          setModalTitle("Action Success");
          setModalMessage("User activated successfully.");
          handleShowModal();
        } catch (error) {
          console.error("Error activating user:", error);
          setModalTitle("Action Failed");
          setModalMessage("Error activating user.");
          handleShowModal();
        }
        break;

      case "DeactivateUser":
        try {
          console.log(
            `Deactivate User with ID: ${userIdForActivateDeactivate}`
          );
          await deactivateUser(userIdForActivateDeactivate);
          fetchUsers().then((response) => {
            setUsers(response.data);
          });
          setModalTitle("Action Success");
          setModalMessage("User deactivated successfully.");
          handleShowModal();
        } catch (error) {
          console.error("Error deactivating user:", error);
          setModalTitle("Action Failed");
          setModalMessage("Error deactivating user.");
          handleShowModal();
        }
        break;

      case "SuspendUser":
        if (!suspensionStartDate || !suspensionEndDate) {
          setModalTitle("Action Failed");
          setModalMessage("Please select both suspension start and end dates.");
          handleShowModal();
          return;
        }
        try {
          console.log(`Suspend User with ID: ${userIdForSuspend}`);
          await suspendUser(
            userIdForSuspend,
            suspensionStartDate,
            suspensionEndDate
          );
          fetchUsers().then((response) => {
            setUsers(response.data);
          });
          setModalTitle("Action Success");
          setModalMessage(`User ${userIdForSuspend} suspended successfully.`);
          handleShowModal();
        } catch (error) {
          console.error("Error suspending user:", error);
          setModalTitle("Action Failed");
          setModalMessage("Error suspending user.");
          handleShowModal();
        }
        break;

      case "SendEmailToUser":
        // Logic is still needed to send an email to the user using the email
        setModalTitle("Action Success");
        setModalMessage("Email sent successfully");
        handleShowModal();
        console.log(`Send Email to User with ID: ${userId}`);
        break;

      default:
        break;
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Container className={styles.dashboardContainer}>
      <Row>
        <Col>
          <div className="container">
            {/* ===============
                USER LIST TABLE
                =============== */}
            <form className={styles.forms}>
              <h2 className="text-center">User List</h2>
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>User Id</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Role</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.userId}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.role}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.status ? "Active" : "Inactive"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </form>

            {/* ===========================
                ACTIVATE OR DEACTIVATE USER
                =========================== */}
            <hr className="my-4" />
            <form className={styles.forms}>
              <h2 className="text-center">Activate or Deactivate a User</h2>
              <Row className="align-items-center justify-content-center">
                <Col md={6}>
                  <Form.Group
                    controlId="userId"
                    className="d-flex justify-content-center"
                  >
                    <Form.Label>User ID</Form.Label>
                    <div className={styles.inputBoxContainer}>
                      <Form.Control
                        type="text"
                        placeholder="Enter User ID"
                        value={userIdForActivateDeactivate}
                        onChange={(e) =>
                          setUserIdForActivateDeactivate(e.target.value)
                        }
                        className={styles.inputBox}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6} className="text-md-right">
                  <Row>
                    <Button
                      variant="success"
                      className="mr-2 mb-2 "
                      style={{ maxWidth: "200px" }}
                      onClick={() => {
                        handleButtonClick("ActivateUser");
                        handleShowModal();
                      }}
                    >
                      Activate User
                    </Button>
                  </Row>
                  <Row>
                    <Button
                      variant="warning"
                      className="mb-2"
                      style={{ maxWidth: "200px" }}
                      onClick={() => {
                        handleButtonClick("DeactivateUser");
                        handleShowModal();
                      }}
                    >
                      Deactivate User
                    </Button>
                  </Row>
                </Col>
              </Row>

              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </form>

            <hr className="my-4" />

            {/* ============
                SUSPEND USER
                ============ */}

            <form className={styles.forms}>
              <h2 className="text-center">Suspend a User</h2>
              <Row className="align-items-center justify-content-center">
                <Col md={3}>
                  <Form.Label>User ID</Form.Label>
                </Col>
                <Col md={3}>
                  <Form.Label>Suspension Start Date</Form.Label>
                </Col>
                <Col md={3}>
                  <Form.Label>Suspension End Date</Form.Label>
                </Col>
                <Col md={3}>
                  <Form.Label></Form.Label>
                </Col>
              </Row>
              <Row className="align-items-center justify-content-center">
                <Col md={3}>
                  <Form.Group
                    controlId="userId"
                    className="d-flex justify-content-center"
                  >
                    <div className={styles.inputBoxContainer}>
                      <Form.Control
                        type="text"
                        placeholder="Enter User ID"
                        value={userIdForSuspend}
                        onChange={(e) => setUserIdForSuspend(e.target.value)}
                        className={styles.inputBox}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group
                    controlId="suspensionStartDate"
                    className="d-flex justify-content-center"
                  >
                    <div className={styles.inputBoxContainer}>
                      <DatePicker
                        selected={suspensionStartDate}
                        onChange={(date) => setSuspensionStartDate(date)}
                        placeholderText="Start Date"
                        className={styles.inputDateBox}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group
                    controlId="suspensionEndDate"
                    className="d-flex justify-content-center"
                  >
                    <div className={styles.inputBoxContainer}>
                      <DatePicker
                        selected={suspensionEndDate}
                        onChange={(date) => setSuspensionEndDate(date)}
                        placeholderText="End Date"
                        className={styles.inputDateBox}
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col md={3} className="text-md-right">
                  <Button
                    variant="warning"
                    className="mb-2"
                    style={{ maxWidth: "200px" }}
                    onClick={() => {
                      handleButtonClick("SuspendUser");
                      handleShowModal();
                    }}
                  >
                    Suspend User
                  </Button>
                </Col>
              </Row>

              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </form>

            <hr className="my-4" />

            {/* ============
                CONTACT USER
                ============ */}
            <form className={styles.forms}>
              <h4>Contact User</h4>

              <Row>
                <Col className="col-md-2">
                  <Form.Group controlId="email">
                    <Form.Label>User Email Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="JohnSmith@email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="custom-textbox"
                      style={{
                        marginLeft: "20px",
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col className="col-md-8">
                  <p>Enter your email below:</p>
                  <label>
                    <textarea
                      name="emailContent"
                      defaultValue=""
                      rows={4}
                      cols={80}
                      align="left"
                      style={{
                        backgroundColor: "#ffffff",
                        color: "black",
                        borderRadius: "5px",
                      }}
                    />
                  </label>
                </Col>
              </Row>

              <Row>
                <p></p>
              </Row>
              <Row>
                <Col>
                  <Button
                    variant="primary"
                    onClick={() => handleButtonClick("SendEmailToUser")}
                  >
                    Send Email to User
                  </Button>
                </Col>
              </Row>
            </form>

            <div style={{ height: "200px" }}></div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserList;
