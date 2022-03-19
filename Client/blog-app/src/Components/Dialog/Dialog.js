import React from "react";
import style from "./dialog.module.css";
const Dialog = ({ title,description,message,hide }) => {
  return (
    <div>
      <div className={style.backdrop} onClick={hide}/>
      <div className={style.dialog}>
        {message && <h4>Information</h4>}
        {title && <h4>{title}</h4>}
        <hr />
        <section className={style.section}>
          {message && <p>{message}</p>}
          {description && <p>{description}</p>}
        </section>
          <button className="btn btn-dark btn-lg btn-block" onClick={hide}>Close</button>
      </div>
    </div>
  );
};
export default Dialog;
