import { useEffect, useState } from "react";
import API from "../services/api";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Modal state for creating new admin
    const [showModal, setShowModal] = useState(false);
    const [newAdmin, setNewAdmin] = useState({
        name: "",
        email: "",
        password: ""
    });

    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isSuperAdmin = currentUser?.role?.toUpperCase() === "SUPER_ADMIN";

    const loadUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await API.get("/api/admin/users");
            setUsers(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch user directory. Ensure you have authorized permissions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await API.post("/api/admin/create-admin", newAdmin);
            setSuccess(`Administrator account created for ${newAdmin.name}!`);
            setShowModal(false);
            setNewAdmin({ name: "", email: "", password: "" });
            loadUsers();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to create administrator account.");
        }
    };

    const handleRoleChange = async (userId, targetRole) => {
        if (!window.confirm(`Are you sure you want to change this user's role to ${targetRole}?`)) {
            return;
        }

        try {
            await API.put(`/api/admin/users/${userId}/role`, { role: targetRole });
            setSuccess(`User role updated to ${targetRole} successfully.`);
            loadUsers();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Failed to update user role.");
        }
    };

    const getRoleBadge = (role) => {
        switch (role?.toUpperCase()) {
            case "SUPER_ADMIN":
                return <span className="badge bg-dark">👑 SUPER ADMIN</span>;
            case "ADMIN":
                return <span className="badge bg-primary">🛡️ ADMIN</span>;
            default:
                return <span className="badge bg-secondary">👤 USER</span>;
        }
    };

    return (
        <div className="container py-4">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h2 className="fw-bold mb-1">User & Role Management</h2>
                    <p className="text-muted mb-0">
                        Oversee accounts, security roles, and administrative staff
                    </p>
                </div>
                {isSuperAdmin && (
                    <button
                        className="btn btn-danger d-flex align-items-center gap-2 shadow-sm"
                        onClick={() => setShowModal(true)}
                    >
                        <span>➕</span> Create New Admin
                    </button>
                )}
            </div>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                </div>
            )}

            {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {success}
                    <button type="button" className="btn-close" onClick={() => setSuccess("")}></button>
                </div>
            )}

            <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">System Directory</h5>
                    <span className="badge bg-secondary">{users.length} Registered Accounts</span>
                </div>

                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-danger" role="status"></div>
                            <p className="mt-2 text-muted">Loading user directory...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-5 text-muted">No users found.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        {isSuperAdmin && <th className="text-end">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td className="fw-semibold">{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{getRoleBadge(user.role)}</td>
                                            {isSuperAdmin && (
                                                <td className="text-end">
                                                    {user.id === currentUser.id ? (
                                                        <span className="text-muted small">Current Account</span>
                                                    ) : user.role?.toUpperCase() === "USER" ? (
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => handleRoleChange(user.id, "ADMIN")}
                                                        >
                                                            Promote to Admin
                                                        </button>
                                                    ) : user.role?.toUpperCase() === "ADMIN" ? (
                                                        <button
                                                            className="btn btn-sm btn-outline-warning"
                                                            onClick={() => handleRoleChange(user.id, "USER")}
                                                        >
                                                            Demote to User
                                                        </button>
                                                    ) : (
                                                        <span className="text-muted small">Super Admin</span>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Admin Modal */}
            {showModal && (
                <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content border-0 shadow">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">Create Administrator</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleCreateAdmin}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Admin Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={newAdmin.name}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                            placeholder="Dr. Robert Green"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Hospital / Staff Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            value={newAdmin.email}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                            placeholder="r.green@hospital.org"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Temporary Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={newAdmin.password}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                            placeholder="Minimum 6 characters"
                                            minLength={6}
                                            required
                                        />
                                        <div className="form-text">
                                            The new administrator can change this password upon initial sign in.
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-danger">
                                        Create Admin
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUsers;
