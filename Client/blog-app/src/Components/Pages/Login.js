import { useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { BASE_URL } from "../../constant";
import Dialog from "../Dialog/Dialog";
const Login = () => {
  const history = useHistory();
  let accessToken = localStorage.getItem('access-token');
  if(accessToken){
    history.push('/blogs');
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const loginHandler = function () {
    if (!email || !password) {
      setError('Please enter email or password');
      return;
    }
    async function login() {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("access-token", data.token);
        localStorage.setItem("refresh-token", data.refreshToken);
        setError(null);
        history.push("/blogs");
      } else {
         setError(data.message);
      }
    }
    login();
  };
  return(
    <>
    {error && <Dialog message={error} hide={()=>setError(null)}/> } 
      <section className="vh-100">
        <div className="container py-2 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card">
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp"
                      alt="login form"
                      className="img-fluid"
                    />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form>
                        <div className="d-flex align-items-center mb-3 pb-1">
                          <i className="fas fa-cubes fa-2x me-3"></i>
                          <span className="h1 fw-bold mb-0">Blog App</span>
                        </div>

                        <h5 className="fw-normal mb-3 pb-3">
                          Sign into your account
                        </h5>

                        <div className="form-outline mb-4">
                          <label className="form-label">Email address</label>
                          <input
                            value={email}
                            type="email"
                            onChange={(event) => setEmail(event.target.value)}
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="form-outline mb-4">
                          <label className="form-label">Password</label>
                          <input
                            value={password}
                            onChange={(event) =>
                              setPassword(event.target.value)
                            }
                            type="password"
                            className="form-control form-control-lg"
                          />
                        </div>

                        <div className="pt-1 mb-4">
                          <button
                            onClick={loginHandler}
                            className="btn btn-dark btn-lg btn-block"
                            type="button"
                          >
                            Login
                          </button>
                        </div>

                        <a className="small text-muted" href="#!">
                          Forgot password?
                        </a>
                        <p className="mb-5 pb-lg-2">
                          Don't have an account?{" "}
                          <Link to={"/auth/register"}>Register here</Link>
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Login;
