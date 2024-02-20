import React, { useState, useContext } from "react";
import logo from "../../assets/logo.png";
import styles from "./ManagerLogin.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import * as userService from "../../services/AuthService";
import AppContext from "../../../context/AppContext";

const ManagerLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { state, setState } = useContext(AppContext);

  const handleLogin = async () => {
    try {
      const user = await userService.loginUser(username, password);
      console.log("Login successful:", user);
      setState({ ...state, isLoggedIn: true, username: user.username });
      // You can handle successful login, e.g., redirect to a dashboard page.
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login failure, e.g., display an error message.
    }
  };

  return (
    <div className={styles.main}>
      {/* Your login page content */}

      <div className={styles.row}>
        <div className={styles.column}>
          <img className={styles.image} src={logo} alt="Logo"></img>
          <h1 className={styles.header}> Ledger Logic</h1>
          <p>A logical approach to accounting.</p>
          <Link className={styles.fixLinks} to="/create-new-user">
            <button className={styles.button}>Register Now</button>
          </Link>
        </div>
        <div className={styles.column}>
          <form className={styles.forms}>
            <h1 className={styles.header}>Manager Login</h1>
            <div>
              <label>
                <p>Username</p>
                <input
                  className={styles.inputBox}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label>
                <p>Password</p>
                <input
                  className={styles.inputBox}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>

            <div>
              <Link className={styles.fixLinks} to="/manager-dashboard">
                <button
                  className={styles.button}
                  type="submit"
                  onClick={handleLogin}
                >
                  Login
                </button>
              </Link>
            </div>
            <div>
              <Link className={styles.fixLinks} to="/forgot-password">
                <button className={styles.button}>Forgot Password?</button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;
