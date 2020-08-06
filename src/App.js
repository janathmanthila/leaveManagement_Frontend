import React, { Component, Fragment } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import BaseRouter from "./components/router/Router.jsx";
import LoginRouter from "./components/router/LoginRouter";


class App extends Component {
  render() {
    return (
      <Fragment>
        <div className="App">
          <Fragment>
            <div className="wrapper">
              <Router>
                <Header />
                <BaseRouter />
                <Footer />
              </Router>
            </div>
          </Fragment>
        </div>

        <Router>
          <LoginRouter />
        </Router>
      </Fragment>
    );
  }
}

export default App;
