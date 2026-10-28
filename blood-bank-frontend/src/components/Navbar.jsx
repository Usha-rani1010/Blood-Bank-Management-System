import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const { language, changeLanguage, t } = useLanguage();

    // Get logged-in user safely
    let user = null;
    try {
        const stored = localStorage.getItem("user");
        if (stored) {
            user = JSON.parse(stored);
        }
    } catch {
        user = null;
    }

    const isAdminOrSuper = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const getRoleBadge = (role) => {
        switch (role?.toUpperCase()) {
            case "SUPER_ADMIN":
                return <span className="badge bg-warning text-dark ms-1">👑 Super Admin</span>;
            case "ADMIN":
                return <span className="badge bg-light text-danger ms-1">🛡️ Admin</span>;
            default:
                return <span className="badge bg-white text-secondary ms-1">User</span>;
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-danger shadow-sm sticky-top">
            <div className="container">
                <Link className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
                    <span className="fs-4">🩸</span>
                    <span>{t("appName")}</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === "/" ? "active fw-bold" : ""}`}
                                to="/"
                            >
                                {t("dashboard")}
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === "/donors" ? "active fw-bold" : ""}`}
                                to="/donors"
                            >
                                {t("donors")}
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === "/inventory" ? "active fw-bold" : ""}`}
                                to="/inventory"
                            >
                                {t("inventory")}
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className={`nav-link ${location.pathname === "/requests" ? "active fw-bold" : ""}`}
                                to="/requests"
                            >
                                {t("requests")}
                            </Link>
                        </li>

                        {isAdminOrSuper && (
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${location.pathname === "/admin/users" ? "active fw-bold text-warning" : "text-warning"}`}
                                    to="/admin/users"
                                >
                                    👥 {t("usersRoles")}
                                </Link>
                            </li>
                        )}
                    </ul>

                    <div className="d-flex align-items-center flex-wrap gap-2">
                        {/* Language Selector */}
                        <select
                            className="form-select form-select-sm bg-light"
                            style={{ width: "auto" }}
                            value={language}
                            onChange={(e) => changeLanguage(e.target.value)}
                            aria-label="Language Selector"
                        >
                            <option value="en">English</option>
                            <option value="te">తెలుగు</option>
                            <option value="hi">हिन्दी</option>
                        </select>

                        {/* Logged-in User profile badge & Logout */}
                        {user ? (
                            <div className="d-flex align-items-center gap-2 ms-2">
                                <span className="text-white fw-semibold small d-flex align-items-center">
                                    👤 {user.name} {getRoleBadge(user.role)}
                                </span>

                                <button
                                    className="btn btn-outline-light btn-sm"
                                    onClick={handleLogout}
                                >
                                    {t("logout")}
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex gap-2 ms-2">
                                <Link to="/login" className="btn btn-outline-light btn-sm">
                                    {t("signIn")}
                                </Link>
                                <Link to="/register" className="btn btn-light btn-sm fw-semibold text-danger">
                                    {t("register")}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;