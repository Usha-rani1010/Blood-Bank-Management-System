import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useLanguage } from "../context/LanguageContext";

function Register() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage({ text: "", type: "" });

        if (formData.password.length < 6) {
            setMessage({
                text: "Password must be at least 6 characters long.",
                type: "danger"
            });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setMessage({
                text: "Passwords do not match.",
                type: "danger"
            });
            return;
        }

        setLoading(true);

        try {
            const response = await API.post("/api/auth/register", {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password
            });

            const { token, user } = response.data;

            if (token && user) {
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
            }

            setMessage({
                text: "Account registered successfully! Redirecting to dashboard...",
                type: "success"
            });

            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (error) {
            console.error("Registration error:", error);
            const errMsg = error.response?.data?.error || "Registration failed. Email may already be registered.";
            setMessage({
                text: typeof errMsg === "string" ? errMsg : "Registration failed.",
                type: "danger"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5">
                    <div className="card shadow border-0 rounded-3">
                        <div className="card-header bg-danger text-white text-center py-4 rounded-top-3">
                            <h2 className="fw-bold mb-1">🩸 {t("appName")}</h2>
                            <p className="mb-0 text-white-50 small">Donor & Recipient Account Registration</p>
                        </div>

                        <div className="card-body p-4 p-md-5">
                            <h4 className="fw-bold mb-3 text-center">Create Account</h4>

                            {message.text && (
                                <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                                    {message.text}
                                </div>
                            )}

                            <form onSubmit={handleRegister}>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. John Doe"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Email Address</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="form-control"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="At least 6 characters"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                    <div className="form-text">Minimum 6 characters.</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Confirm Password</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-control"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter password"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-danger w-100 py-2 fw-semibold mt-2 shadow-sm"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Creating Account...
                                        </>
                                    ) : (
                                        "Register"
                                    )}
                                </button>
                            </form>

                            <div className="text-center mt-4 pt-3 border-top">
                                <p className="text-muted mb-0">
                                    Already have an account?{" "}
                                    <Link to="/login" className="text-danger fw-semibold text-decoration-none">
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
