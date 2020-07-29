import React from "react";
import { Route } from "react-router-dom";
import Login from "../login/Login";

const LoginRouter = () => (
  <div>
    <Route exact path="/login" component={Login} />
  </div>
);

export default LoginRouter;
