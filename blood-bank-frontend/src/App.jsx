import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WelcomeLanguageModal from "./components/WelcomeLanguageModal";

import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Donors from "./pages/Donors";
import Inventory from "./pages/Inventory";
import Requests from "./pages/Requests";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminUsers from "./pages/AdminUsers";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <div className="d-flex flex-column min-vh-100">
                <WelcomeLanguageModal />
                <Navbar />

                <main className="container mt-4 flex-grow-1">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route
                            path="/donors"
                            element={
                                <ProtectedRoute>
                                    <Donors />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/inventory"
                            element={
                                <ProtectedRoute>
                                    <Inventory />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/requests"
                            element={
                                <ProtectedRoute>
                                    <Requests />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin & Super Admin protected user management */}
                        <Route
                            path="/admin/users"
                            element={
                                <ProtectedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
                                    <AdminUsers />
                                </ProtectedRoute>
                            }
                        />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>

                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;