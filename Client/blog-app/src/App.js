import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Blogs from "./Components/Pages/Blogs";
import Login from "./Components/Pages/Login";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import Register from "./Components/Pages/Register";
import Logout from "./Components/Pages/Logout";
import AddPost from "./Components/Pages/addPost/AddPost";

function App() {
 const history =  useHistory();
  return (
    <div>
      <Header />
      <main>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/auth/login" />
          </Route>
          <Route path="/auth/login" exact>
          <Login />
          </Route>
          <Route path="/auth/register">
            <Register />
          </Route>
          <Route path="/blogs" exact>
            <div className="container">
              <Blogs />
            </div>
          </Route>
          <Route path='/add-post'>
          <AddPost history={history} hide={()=>history.push('/blogs')}/>
          </Route>
          <Route path="/logout" exact>
          <div className="container">
              <Logout />
            </div>
          </Route>
          <div className="text-center p-5">
            <h2 className="display-4">404 Page not found</h2>
          </div>
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;
