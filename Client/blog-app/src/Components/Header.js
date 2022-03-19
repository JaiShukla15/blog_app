import {NavLink} from 'react-router-dom';
const Header = function () {
  let token = localStorage.getItem('access-token');
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <NavLink to='/auth/login' className="navbar-brand">
            Blog App
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse d-flex" id="navbarSupportedContent">

            {token &&<ul className="navbar-nav me-auto mb-2 mb-lg-0 me-2">
              <li className="nav-item">
                <NavLink className="nav-link active" to='/add-post' exact aria-current="page">
                  Add
                </NavLink>
              </li>
              {token ?   <li className="nav-item">
                <NavLink className="nav-link active" to='/logout' exact aria-current="page">
                  Logout
                </NavLink>
              </li> : null}
  
            </ul>}
          
          </div>
        </div>
      </nav>
    </div>
  );
}
export default Header;