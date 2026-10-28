import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useLanguage } from "../context/LanguageContext";

function Login() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        try {
            const response = await API.post("/api/auth/login", {
                email: email.trim(),
                password: password
            });

            const { token, user } = response.data;

            // Persist JWT token and user profile
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            setMessage({
                text: `Welcome back, ${user.name}! (${user.role})`,
                type: "success"
            });

            setTimeout(() => {
                navigate("/");
            }, 800);

        } catch (error) {
            console.error("Login failed:", error);
            const errMsg = error.response?.data?.error || error.response?.data || "Invalid email or password";
            setMessage({
                text: typeof errMsg === "string" ? errMsg : "Login failed. Please check your credentials.",
                type: "danger"
            });
        } finally {
            setLoading(false);
        }
    };

    const fillCredentials = (demoEmail, demoPass) => {
        setEmail(demoEmail);
        setPassword(demoPass);
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="card shadow border-0 rounded-3">
                        <div className="card-header bg-danger text-white text-center py-4 rounded-top-3">
                            <h2 className="fw-bold mb-1">🩸 {t("appName")}</h2>
                            <p className="mb-0 text-white-50 small">Secure Healthcare Portal Access</p>
                        </div>

                        <div className="card-body p-4 p-md-5">
                            <h4 className="fw-bold mb-3 text-center">Sign In</h4>

                            {message.text && (
                                <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@hospital.org"
                                        required
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password"
                                            required
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-danger w-100 py-2 fw-semibold mt-2 shadow-sm"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Signing In...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>
                            </form>

                            <div className="text-center mt-4 pt-3 border-top">
                                <p className="text-muted mb-0">
                                    Don't have an account?{" "}
                                    <Link to="/register" className="text-danger fw-semibold text-decoration-none">
                                        Create an Account
                                    </Link>
                                </p>
                            </div>

                            {/* Demo Accounts Quick-Fill Box for evaluation */}
                            <div className="mt-4 p-3 bg-light rounded-3 small">
                                <span className="fw-bold d-block mb-2 text-secondary">
                                    ⚡ Evaluation Quick Login:
                                </span>
                                <div className="d-flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-dark"
                                        onClick={() => fillCredentials("superadmin@bloodbank.org", "SuperAdmin@2026!")}
                                    >
                                        Super Admin
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => fillCredentials("admin@bloodbank.org", "Admin@2026!")}
                                    >
                                        Hospital Admin
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => fillCredentials("john@example.com", "Password@123")}
                                    >
                                        Normal User
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;