import React, { Component, Fragment } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/layout/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import BaseRouter from "./components/router/Router.jsx";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Fragment>
          <div className="wrapper">
              <BaseRouter />
          </div>
        </Fragment>
      </div>
    );
  }
}

export default App;
