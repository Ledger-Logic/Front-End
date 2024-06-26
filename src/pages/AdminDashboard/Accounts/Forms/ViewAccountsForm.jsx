import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { fetchAccounts } from "../../../../services/AccountService";
import styles from "./AccountForm.module.css";
import DatePicker from "react-datepicker";
import "./DatePickerStyles.css";
import { Link, useNavigate } from "react-router-dom";
import { emailUser } from "../../../../services/EmailService";

const AdminViewAccountsForm = ({ isGeneralLedger }) => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilterOption, setSelectedFilterOption] = useState("");
  const [activeTab, setActiveTab] = useState("Chart of Accounts");
  const [selectedFilterOptionText, setSelectedFilterOptionText] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([
    "Assets",
    "Liabilities",
    "equity",
    "revenue",
    "expenses",
  ]);
  const [subcategoryFilter, setSubcategoryFilter] = useState("");
  const [normalSideFilter, setNormalSideFilter] = useState("");
  const [balanceFilter, setBalanceFilter] = useState({ min: "", max: "" });
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [email, setEmail] = useState("");
  const subject = "Ledger Logic: Message from Administrator";
  const fromEmail = "hrosser15@gmail.com";
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAccounts();
        setAccounts(response.data);
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
      }
    };

    fetchData();
  }, []);

  const handleAccountSelection = (account) => {
    navigate(`/admin-accounts-management/ledgers/${account.accountId}`);
  };

  const handleButtonClick = () => {
    if (!email) {
      // Alert the user if the email field is empty
      alert("Please enter an email address");
      return;
    }

    // Assuming you have access to the email content from the textarea
    const emailContent = document.querySelector(
      'textarea[name="emailContent"]'
    ).value;

    // Call the emailUser function with the email and emailContent
    emailUser(email, fromEmail, subject, emailContent)
      .then((response) => {
        // Handle successful email sending
        setModalTitle("Email Sent");
        setModalMessage("Email sent successfully!");
        setShowModal(true); // Optionally, you can display a modal to inform the user
      })
      .catch((error) => {
        // Handle error if email sending fails
        console.error("Error sending email:", error);
        setModalTitle("Email Error");
        setModalMessage(
          "There was an error sending the email. Please try again later."
        );
        setShowModal(true); // Optionally, you can display a modal to inform the user
      });
  };

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    if (tab === "Chart of Accounts") {
      setSelectedAccount(null);
    }
  };

  const filterOptions = [
    { value: "category", label: "Account Category", type: "checkbox" },
    { value: "subcategory", label: "Account Subcategory", type: "text" },
    { value: "balance", label: "Account Balance", type: "range" },
    { value: "normalSide", label: "Normal Side", type: "radio" },
    { value: "date", label: "Date Created", type: "date" },
  ];

  const formatDate2 = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      date
    );
    const day = date.getDate();

    return `${year}, ${month} ${day}`;
  };

  const filterAccountsByRange = (start, end) => {
    if (!accounts) {
      return []; // Return an empty array if accounts is undefined or not provided
    }

    return accounts.filter(
      (account) =>
        parseInt(account.accountNumber) >= start &&
        parseInt(account.accountNumber) <= end
    );
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const assetAccounts = filterAccountsByRange(1000, 1999);
  const liabilityAccounts = filterAccountsByRange(3000, 3999);
  const equityAccounts = filterAccountsByRange(5000, 5999);
  const revenueAccounts = filterAccountsByRange(6000, 6999);
  const expenseAccounts = filterAccountsByRange(7000, 7999);

  const handleFilterChange = (event) => {
    const selectedOption = filterOptions.find(
      (option) => option.value === event.target.value
    );

    setSelectedFilterOption(selectedOption.value);
    setSelectedFilterOptionText(selectedOption.label);
  };

  const handleCategoryChange = (category) => {
    const updatedCategories = [...selectedCategories];
    const index = updatedCategories.indexOf(category);

    if (index === -1) {
      updatedCategories.push(category);
    } else {
      updatedCategories.splice(index, 1);
    }

    setSelectedCategories(updatedCategories);
  };

  const handleSubcategoryFilterChange = (event) => {
    setSubcategoryFilter(event.target.value);
  };

  const handleNormalSideFilterChange = (event) => {
    setNormalSideFilter(event.target.value);
  };

  const handleBalanceFilterChange = (event, field) => {
    const value = event.target.value.replace(/[^0-9.]/g, "");
    setBalanceFilter((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleDateFilterChange = (date, field) => {
    setDateFilter((prevState) => ({
      ...prevState,
      [field]: date ? date.toISOString() : "",
    }));
  };

  const renderFilterOptions = () => {
    switch (selectedFilterOption) {
      case "category":
        return (
          <div>
            <Form.Check
              type="checkbox"
              id="assetCheckbox"
              label="Assets"
              checked={selectedCategories.includes("Assets")}
              onChange={() => handleCategoryChange("Assets")}
            />
            <Form.Check
              type="checkbox"
              id="liabilityCheckbox"
              label="Liabilities"
              checked={selectedCategories.includes("Liabilities")}
              onChange={() => handleCategoryChange("Liabilities")}
            />
            <Form.Check
              type="checkbox"
              id="equityCheckbox"
              label="Equity"
              checked={selectedCategories.includes("equity")}
              onChange={() => handleCategoryChange("equity")}
            />
            <Form.Check
              type="checkbox"
              id="revenueCheckbox"
              label="Revenue"
              checked={selectedCategories.includes("revenue")}
              onChange={() => handleCategoryChange("revenue")}
            />
            <Form.Check
              type="checkbox"
              id="expenseCheckbox"
              label="Expenses"
              checked={selectedCategories.includes("expenses")}
              onChange={() => handleCategoryChange("expenses")}
            />
          </div>
        );
      case "subcategory":
        return (
          <Form.Control
            type="text"
            value={subcategoryFilter}
            onChange={handleSubcategoryFilterChange}
            placeholder="Enter subcategory"
          />
        );
      case "normalSide":
        return (
          <div>
            <Form.Check
              type="radio"
              id="debitRadio"
              label="Debit"
              value="Debit"
              checked={normalSideFilter === "Debit"}
              onChange={handleNormalSideFilterChange}
            />
            <Form.Check
              type="radio"
              id="creditRadio"
              label="Credit"
              value="Credit"
              checked={normalSideFilter === "Credit"}
              onChange={handleNormalSideFilterChange}
            />
          </div>
        );
      case "balance":
        return (
          <div>
            <Form.Control
              type="text"
              placeholder="Minimum"
              value={balanceFilter.min}
              onChange={(e) => handleBalanceFilterChange(e, "min")}
            />
            <Form.Control
              type="text"
              placeholder="Maximum"
              value={balanceFilter.max}
              onChange={(e) => handleBalanceFilterChange(e, "max")}
            />
          </div>
        );
      case "date":
        return (
          <div>
            <div
              className={`${styles.datePickerContainer} ${styles.leftAlignedDatePicker}`}
            >
              <DatePicker
                selected={dateFilter.start ? new Date(dateFilter.start) : null}
                onChange={(date) => handleDateFilterChange(date, "start")}
                placeholderText="Start Date"
              />
            </div>
            <div
              className={`${styles.datePickerContainer} ${styles.leftAlignedDatePicker}`}
            >
              <DatePicker
                selected={dateFilter.end ? new Date(dateFilter.end) : null}
                onChange={(date) => handleDateFilterChange(date, "end")}
                placeholderText="End Date"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderTable = (tableTitle, tableAccounts) => {
    let filteredTableAccounts = tableAccounts;

    // Filter by category
    if (selectedFilterOption === "category") {
      filteredTableAccounts = tableAccounts.filter((account) =>
        selectedCategories.some(
          (category) =>
            category.toLowerCase() === account.category.toLowerCase()
        )
      );
    }

    // Filter by subcategory
    if (selectedFilterOption === "subcategory") {
      filteredTableAccounts = tableAccounts.filter((account) =>
        account.subCategory
          .toLowerCase()
          .includes(subcategoryFilter.toLowerCase())
      );
    }

    // Filter by normal side
    if (selectedFilterOption === "normalSide") {
      filteredTableAccounts = tableAccounts.filter(
        (account) => account.normalSide === normalSideFilter
      );
    }

    // Filter by balance
    if (selectedFilterOption === "balance") {
      filteredTableAccounts = tableAccounts.filter(
        (account) =>
          account.balance >= parseFloat(balanceFilter.min) &&
          account.balance <= parseFloat(balanceFilter.max)
      );
    }

    // Filter by creation date
    if (selectedFilterOption === "date") {
      filteredTableAccounts = tableAccounts.filter((account) => {
        const creationDate = new Date(account.creationDate);
        const startDate = new Date(dateFilter.start);
        const endDate = new Date(dateFilter.end);
        endDate.setHours(23, 59, 59, 999); // Set the end date to the end of the day

        return creationDate >= startDate && creationDate <= endDate;
      });
    }

    // Additional filtering based on the search term
    filteredTableAccounts = filteredTableAccounts.filter(
      (account) =>
        account.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.accountNumber.toString().includes(searchTerm.toLowerCase())
    );

    if (filteredTableAccounts.length === 0) {
      return null;
    }

    return (
      <form className={styles.forms}>
        <h2 className="text-center">{tableTitle}</h2>
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>No.</th>
              <th>Account Name</th>
              <th>Subcategory</th>
              <th>Normal Side</th>
              <th>Description</th>
              <th>Balance</th>
              <th>Statement</th>
              <th>Creation Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTableAccounts.map((account) => (
              <tr
                key={account.accountNumber}
                className={!account.active ? "table-danger" : ""}
              >
                <td className={!account.active ? styles.strikethrough : ""}>
                  <span
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => {
                      console.log("Clicked account:", account);
                      handleAccountSelection(account);
                    }}
                  >
                    {account.accountNumber}
                  </span>
                </td>
                <td className={!account.active ? styles.strikethrough : ""}>
                  <span
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => {
                      console.log("Clicked account:", account);
                      handleAccountSelection(account);
                    }}
                  >
                    {account.accountName}
                  </span>
                </td>
                <td className={!account.active ? styles.strikethrough : ""}>
                  {account.subCategory}
                </td>
                <td className={!account.active ? styles.strikethrough : ""}>
                  {account.normalSide}
                </td>
                <td>
                  <span className={!account.active ? styles.strikethrough : ""}>
                    {account.description}
                  </span>
                  {!account.active && <span> (account deactivated)</span>}
                </td>
                <td className={!account.active ? styles.strikethrough : ""}>
                  {parseFloat(account.balance).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </td>
                <td className={!account.active ? styles.strikethrough : ""}>
                  {account.statement}
                </td>
                <td className={!account.active ? styles.strikethrough : ""}>
                  {formatDate2(account.creationDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    );
  };

  return (
    <Container className={styles.dashboardContainer}>
      <Row className="mb-4">
        <Col>
          <div className="container">
            <Form.Group
              controlId="searchTerm"
              className="d-flex flex-column align-items-start"
            >
              <Form.Label className="mr-2">Search Accounts:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Account Name or Account No."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                  maxWidth: "400px",
                  marginRight: "10px",
                }}
              />
            </Form.Group>
          </div>
        </Col>
        <Col>
          <div className="container">
            <Form.Group
              controlId="filterCriteria"
              className="d-flex flex-column align-items-start"
            >
              <Form.Label className="mr-2">Filter Accounts:</Form.Label>
              <Form.Control
                as="select"
                value={selectedFilterOption || ""} // Display the selected filter option text
                onChange={handleFilterChange}
                style={{ maxWidth: "400px", marginBottom: "10px" }}
              >
                <option value="">Select Filter</option>
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Control>

              {renderFilterOptions()}
            </Form.Group>
          </div>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <div className="container">
            {renderTable("Assets", assetAccounts, isGeneralLedger)}
            {renderTable("Liabilities", liabilityAccounts, isGeneralLedger)}
            {renderTable("Equity", equityAccounts, isGeneralLedger)}
            {renderTable("Revenue", revenueAccounts, isGeneralLedger)}
            {renderTable("Expenses", expenseAccounts, isGeneralLedger)}
            <div style={{ height: "80px" }}></div>
          </div>
        </Col>
      </Row>
      <Row>
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
              <Button variant="primary" onClick={handleButtonClick}>
                Send Email to User
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
        <div style={{ height: "200px" }}></div>
      </Row>
    </Container>
  );
};

export default AdminViewAccountsForm;
