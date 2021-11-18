import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { LOGIN } from "../gql/mutation";
import { storeToken } from "../authToken";

const Login = (props) => {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});

  const [loginUser] = useMutation(LOGIN, {
    update(_, data) {
      storeToken(data.data.login);
      props.history.push("/");
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    variables: values,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
  };

  return (
    <div className="container" style={{ width: "inherit", height: "inherit" }}>
      <main
        className="form-signin d-flex align-items-center justify-content-center"
        style={{ width: "inherit", height: "inherit" }}
      >
        <form className="w-25" onSubmit={handleSubmit}>
          <h1 className="h3 mb-3 fw-normal text-center">Sign in</h1>

          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              name="username"
              required
              autoFocus={true}
              value={values.username}
              onChange={(e) => {
                setValues({ ...values, [e.target.name]: e.target.value });
              }}
              placeholder="Username"
            />
            <label htmlFor="floatingInput">Username</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              name="password"
              required
              value={values.password}
              onChange={(e) => {
                setValues({ ...values, [e.target.name]: e.target.value });
              }}
              placeholder="Password"
            />
            <label htmlFor="floatingPassword">Password</label>
            <small className="text-danger">
              {errors.password} {errors.username}
            </small>
          </div>

          <button className="mb-3 w-100 btn btn-primary" type="submit">
            Sign in
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;
