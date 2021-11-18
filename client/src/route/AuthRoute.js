import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getToken } from "../authToken";

const AuthRoute = ({ component: Component, ...rest }) => {
  const { username: user } = getToken();
  return <Route {...rest} render={(props) => (user ? <Component {...props} /> : <Redirect to="/login" />)} />;
};

export default AuthRoute;
