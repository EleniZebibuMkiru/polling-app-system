import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-text">
        © {new Date().getFullYear()} Online Polling System
      </div>

      <div className="footer-links">
        <Link to="/about us">About us</Link>
      </div>

    </footer>
  );
}

export default Footer;