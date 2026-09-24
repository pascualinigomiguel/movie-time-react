import { Link, NavLink } from "react-router-dom";
import "../css/Navbar.css";

function NavBar() {
  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo" aria-label="Movie Time home">
        <svg className="logo-mark" viewBox="0 0 24 24" aria-hidden="true">
          <rect width="24" height="24" rx="7" fill="currentColor" />
          <path d="M9.5 7.5v9l7.5-4.5z" fill="#241a06" />
        </svg>
        <span>Movie Time</span>
      </Link>
      <div className="navbar-links">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/favorites" className={linkClass}>
          Favorites
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;