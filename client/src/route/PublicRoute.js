import React from "react";
import { Route, Redirect } from "react-router-dom";
import { getToken } from "../authToken";

const PublicRoute = ({ component: Component, ...rest }) => {
  const { username: user } = getToken();
  return <Route {...rest} render={(props) => (user ? <Redirect to="/" /> : <Component {...props} />)} />;
};

export default PublicRoute;
