import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <Link class="navbar-brand" to="/">
            Ecommerce
          </Link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <Link class="nav-link active" aria-current="page" to="/addProduct">
                  Add Product
                </Link>
              </li>
              <li class="nav-item">
                <Link
                  class="nav-link active"
                  aria-current="page"
                  to="/login"
                  style={{ position :'absolute',right:'15%'}}
                >
                  Login
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/register" style={{ position :'absolute',right:'5%'}}>
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
