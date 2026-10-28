import { Navigate, Link } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
        return <Navigate to="/login" replace />;
    }

    let user;
    try {
        user = JSON.parse(userStr);
    } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = user.role ? user.role.toUpperCase() : "USER";
        const hasPermission = allowedRoles.some(
            (role) => role.toUpperCase() === userRole
        );

        if (!hasPermission) {
            return (
                <div className="container py-5 text-center">
                    <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: "500px" }}>
                        <div className="display-1 text-danger mb-3">⛔</div>
                        <h3 className="fw-bold mb-2">Access Restricted</h3>
                        <p className="text-muted mb-4">
                            Your account ({user.name} - {user.role}) does not have permission to view this section.
                        </p>
                        <Link to="/" className="btn btn-danger">
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            );
        }
    }

    return children;
}

export default ProtectedRoute;