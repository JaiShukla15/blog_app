import { useState } from "react";
import { useHistory } from "react-router-dom";
import { BASE_URL } from "../../constant";
import Dialog from "../Dialog/Dialog";
import styles from "./Logout.module.css";
const Logout = (props) => {
  const history = useHistory();
  const onLogout = async () => {
    const response = await fetch(`${BASE_URL}/users/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access-token")}`,
      },
    });
    let data = await response.json();
    if (data) {
      localStorage.clear();
      history.push("/auth/login");
    }
  };
  return (
    <>
      <div>
        <div className={styles.backdrop}/>
        <div className={styles.dialog}>
          <h4>Logout</h4>
          <hr />
          <section className={styles.section}>
            <p>Are you sure you want to logout</p>
          </section>
          <div className="row">
          <div className="col-md-6  mb-2">
            <button
              className="btn btn-dark btn-lg btn-block"
              onClick={history.goBack}
            >
              Close
            </button>
            </div>
            <div className="col-md-6 mb-2">
              <button
                className="btn btn-dark btn-lg btn-block"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Logout;
