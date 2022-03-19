import { useReducer, useState } from "react";
import { BASE_URL } from "../../../constant";
import styles from "./Add.module.css";
import Dialog from "../../Dialog/Dialog";
const postReducer = (state, action) => {
  if (action.type == "ADD") {
    return {
      ...action.val,
    };
  }
  return {
    title: { value: "", isValid: false },
    description: { value: "", isValid: false },
  };
};
const AddPost = (props) => {
  const [error, setError] = useState(false);
  const [postState, dispatchPost] = useReducer(postReducer, {
    title: { value: "", isValid: false },
    description: { value: "", isValid: false },
  });
  const addHandler = async (event) => {
    event.preventDefault();
    const response = await fetch(`${BASE_URL}/posts/add`, {
      method: "post",
      body: JSON.stringify({
        title: postState.title.value,
        description: postState.description.value,
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization":`Bearer ${localStorage.getItem('access-token')}`
      },
    });
    if(response.status===401){
        props.history.push('/auth/login');
    }
    await response.json()
    if(response.status===201){
     props.hide();
     props.history.push('/blogs'); 
    }
  };
  const updateTitle = (event) => {
    dispatchPost({
      type: "ADD",
      val: {
        ...postState,
        title: {
          value: event.target.value,
          isValid: event.target.value ? true : false,
        },
      },
    });
  };
  const updateDescription = (event) => {
    dispatchPost({
      type: "ADD",
      val: {
        ...postState,
        description: {
          value: event.target.value,
          isValid: event.target.value ? true : false,
        },
      },
    });
  };
  return (
    <>
      {error && <Dialog  message={error} hide={() => setError(false)} />}
      <div>
        <div className={styles.backdrop} onClick={()=>props.hide()} />
        <div className={styles["post-section"]}>
          <form className="form" method="post" onSubmit={addHandler}>
            <div className="form-group">
              <label className="label">Title</label>
              <input
                type="text"
                className="form-control"
                onChange={updateTitle}
                value={postState.title.value}
              />
            </div>
            <div className="form-group">
              <label className="label">Description</label>
              <textarea
                type="text"
                onChange={updateDescription}
                className="form-control"
                value={postState.description.value}
              />
            </div>
            <br />
            <div className="button-section">
              <button className="btn btn-primary">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default AddPost;
