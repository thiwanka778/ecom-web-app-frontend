import React from 'react';
import "./Nav.css";
import Avatar from "@mui/material/Avatar";
import { NavLink } from "react-router-dom";

const Nav = () => {

  return (
   <nav
        style={{
            background:"#fcfcfc",
            zIndex:"20000",
          display: "flex",
          height:"10vh",
          paddingLeft:"0.8rem",
          paddingRight:"0.8rem",
          width: "100%",
          alignItems: "center",
          boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
          borderBottomLeftRadius:"15px",
          borderBottomRightRadius:"15px",
          position:"fixed",
          top:0,
          left:0,
        }}
      >
        <p
          style={{
            marginRight: "auto",
            fontWeight: "bold",
            fontSize: "1.5rem",
            fontFamily: "'Ubuntu', sans-serif",
            letterSpacing: "0.1rem",
          }}
        >
          ECOM
        </p>
        <NavLink to="/" className="nav-link-style"
          style={{
            marginRight: "1rem",
            fontFamily: "'Open Sans', sans-serif",
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
        >
          Home
        </NavLink>

        <NavLink to="/login" className="nav-link-style"
          style={{
            marginRight: "1rem",
            fontFamily: "'Open Sans', sans-serif",
            fontSize: "1.1rem",
            fontWeight: "bold",
          }}
        >
          Login
        </NavLink>

        <div>
          <Avatar alt="Remy Sharp" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" />
        </div>
      </nav>
  )
}

export default Nav