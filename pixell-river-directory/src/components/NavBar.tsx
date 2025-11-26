import logo from "../assets/logo.png";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <header className="site-header">
      <div className="brand">
        <img src={logo} alt="Pixell River Financial Logo" className="logo" />
        <div className="brand-text">
          <strong>Pixell River Financial</strong>
          <span className="tagline">People &amp; Organization</span>
        </div>
      </div>

      <nav aria-label="Primary">
        <ul className="nav-list">
          <li>
            <NavLink to="/employees" className={({isActive}) => isActive ? "active" : ""}>
              Employees
            </NavLink>
          </li>
          <li>
            <NavLink to="/organization" className={({isActive}) => isActive ? "active" : ""}>
              Organization
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}