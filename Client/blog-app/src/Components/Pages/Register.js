import { Link } from "react-router-dom";

const Register = function () {
  return (
    <>
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
                          <i
                            className="fas fa-cubes fa-2x me-3"
                          ></i>
                          <span className="h1 fw-bold mb-0">Register</span>
                        </div>

                        <div className="form-outline mb-4">
                          <input
                            type="email"
                            name="email"
                            className="form-control form-control-lg"
                          />
                          <label className="form-label">
                            Email address
                          </label>
                        </div>

                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            name="upassword"
                            className="form-control form-control-lg"
                          />
                          <label className="form-label">
                            Password
                          </label>
                        </div>
                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            name="uconfirmPass"
                            className="form-control form-control-lg"
                          />
                          <label className="form-label">
                            Confirm Password
                          </label>
                        </div>

                        <div className="pt-1 mb-4">
                          <button
                            className="btn btn-dark btn-lg btn-block"
                            type="button"
                          >
                            Sign up
                          </button>
                        </div>
                        <p className="mb-5 pb-lg-2" >
                          Already have an account &nbsp; 
                          <Link to={'/auth/login'}>
                           Login
                          </Link>
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
export default Register;
