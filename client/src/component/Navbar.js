import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getToken, storeToken } from "../authToken";
import { LOGOUT } from "../gql/mutation";
import AddItem from "../pages/AddItem";

const Navbar = () => {
  const [modalAdd, setModalAdd] = useState(false);
  const user = getToken();
  const [logout, { client }] = useMutation(LOGOUT);
  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
    storeToken(null);
    await client.resetStore();
  };

  if (!user) return <></>;

  return (
    <>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              {user.username.toUpperCase()}
            </Link>
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
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="#"
                    onClick={() => setModalAdd(true)}
                  >
                    Add Item
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    onClick={handleLogout}
                    style={{ color: "red" }}
                    to="#"
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <AddItem modalAdd={modalAdd} setModalAdd={setModalAdd} />
    </>
  );
};

export default Navbar;
