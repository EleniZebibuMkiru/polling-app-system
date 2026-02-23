import { Link } from "react-router-dom";
import "./adminNavbar.css"; // ✅ Import the CSS file

function AdminNavbar() {
  return (
    <nav className="admin-navbar">
      <div className="admin-logo">
        <h1>Polling Admin</h1>
      </div>
      <ul className="admin-nav-links">
        <li><Link to="/admin">Dashboard</Link></li>
        <li><Link to="/admin/create">Create</Link></li>
        <li><Link to="/admin/manage">Polls</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
        <li><Link to="/admin/results">Results</Link></li>
      </ul>
    </nav>
  );
}

export default AdminNavbar;