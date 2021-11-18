import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import axios from "axios";

import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import AuthRoute from "./route/AuthRoute";
import PublicRoute from "./route/PublicRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { storeToken } from "./authToken";
import Loading from "./component/Loading";

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .post(process.env.REACT_APP_REFRESH_URI, {}, { withCredentials: true })
      .then(async (data) => {
        const token = await data.data;
        storeToken(token);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  if (loading) {
    return <Loading />;
  }
  return (
    <AuthProvider>
      <BrowserRouter>
        <Switch>
          <PublicRoute path="/login" component={Login} />
          <AuthRoute path="/" component={Dashboard} />
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
