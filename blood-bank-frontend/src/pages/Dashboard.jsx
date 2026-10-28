import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { useLanguage } from "../context/LanguageContext";

function Dashboard() {
    const { t } = useLanguage();

    const [dashboard, setDashboard] = useState({
        totalDonors: 0,
        totalBloodUnits: 0,
        totalRequests: 0,
        pendingRequests: 0
    });

    const [requests, setRequests] = useState([]);
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        // Dashboard statistics
        API.get("/api/dashboard")
            .then((response) => {
                setDashboard(response.data);
            })
            .catch((error) => {
                console.error("Dashboard Error:", error);
            });

        // Blood requests
        API.get("/api/requests")
            .then((response) => {
                setRequests(response.data);
            })
            .catch((error) => {
                console.error("Requests Error:", error);
            });

        // Blood inventory
        API.get("/api/inventory")
            .then((response) => {
                setInventory(response.data);
            })
            .catch((error) => {
                console.error("Inventory Error:", error);
            });
    }, []);

    // Request status color
    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-warning text-dark";
            case "approved":
                return "bg-primary";
            case "completed":
                return "bg-success";
            case "rejected":
                return "bg-danger";
            default:
                return "bg-secondary";
        }
    };

    // Inventory status
    const getInventoryStatus = (units) => {
        if (units === 0) {
            return {
                text: t("outOfStock"),
                className: "bg-danger"
            };
        }

        if (units < 5) {
            return {
                text: t("lowStock"),
                className: "bg-warning text-dark"
            };
        }

        return {
            text: t("available"),
            className: "bg-success"
        };
    };

    return (
        <div className="dashboard-page">
            {/* Dashboard Heading */}
            <div className="mb-4">
                <h2 className="fw-bold">{t("dashboardTitle")}</h2>
                <p className="text-muted">{t("dashboardSubtitle")}</p>
            </div>


            {/* Dashboard Cards */}
            <div className="row g-3 mb-2">
                {/* Total Donors */}
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h6 className="text-muted">{t("totalDonors")}</h6>
                            <h2 className="fw-bold text-primary">{dashboard.totalDonors}</h2>
                            <p className="mb-0 text-muted">{t("registeredDonors")}</p>
                        </div>
                    </div>
                </div>

                {/* Blood Units */}
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h6 className="text-muted">{t("bloodUnits")}</h6>
                            <h2 className="fw-bold text-danger">{dashboard.totalBloodUnits}</h2>
                            <p className="mb-0 text-muted">{t("unitsAvailable")}</p>
                        </div>
                    </div>
                </div>

                {/* Total Requests */}
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h6 className="text-muted">{t("totalRequests")}</h6>
                            <h2 className="fw-bold text-success">{dashboard.totalRequests}</h2>
                            <p className="mb-0 text-muted">{t("bloodRequestsCount")}</p>
                        </div>
                    </div>
                </div>

                {/* Pending Requests */}
                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h6 className="text-muted">{t("pendingRequests")}</h6>
                            <h2 className="fw-bold text-warning">{dashboard.pendingRequests}</h2>
                            <p className="mb-0 text-muted">{t("awaitingAction")}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card shadow-sm border-0 mb-4 mt-3">
                <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">{t("quickActions")}</h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-12 col-md-4">
                            <Link to="/donors" className="btn btn-primary w-100 py-3 fw-semibold">
                                🩸 {t("addManageDonors")}
                            </Link>
                        </div>

                        <div className="col-12 col-md-4">
                            <Link to="/inventory" className="btn btn-danger w-100 py-3 fw-semibold">
                                📦 {t("manageInventory")}
                            </Link>
                        </div>

                        <div className="col-12 col-md-4">
                            <Link to="/requests" className="btn btn-warning w-100 py-3 fw-semibold">
                                🚨 {t("createRequest")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blood Group Overview */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-danger text-white">
                    <h5 className="mb-0">{t("bloodGroupOverview")}</h5>
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        {inventory.length === 0 ? (
                            <div className="col-12 text-center text-muted">
                                {t("noInventoryFound")}
                            </div>
                        ) : (
                            inventory.map((item) => {
                                const inventoryStatus = getInventoryStatus(item.availableUnits);

                                return (
                                    <div className="col-12 col-sm-6 col-md-3" key={item.id}>
                                        <div className="border rounded p-3 text-center h-100">
                                            <h4 className="text-danger fw-bold">{item.bloodGroup}</h4>
                                            <h3 className="fw-bold">{item.availableUnits}</h3>
                                            <small className="text-muted d-block mb-2">
                                                {t("unitsAvailable")}
                                            </small>
                                            <span className={`badge ${inventoryStatus.className}`}>
                                                {inventoryStatus.text}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Blood Requests */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-danger text-white">
                    <h5 className="mb-0">{t("recentRequests")}</h5>
                </div>
                <div className="card-body">
                    {requests.length === 0 ? (
                        <p className="text-center text-muted mb-0">
                            {t("noRecentRequests")}
                        </p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>{t("patientName")}</th>
                                        <th>{t("bloodGroup")}</th>
                                        <th>{t("unitsRequired")}</th>
                                        <th>{t("hospital")}</th>
                                        <th>{t("status")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests
                                        .slice(-5)
                                        .reverse()
                                        .map((request) => (
                                            <tr key={request.id}>
                                                <td>{request.patientName}</td>
                                                <td>
                                                    <span className="badge bg-danger-subtle text-danger border border-danger fw-bold px-2 py-1">
                                                        {request.bloodGroup}
                                                    </span>
                                                </td>
                                                <td>{request.unitsRequired}</td>
                                                <td>{request.hospital}</td>
                                                <td>
                                                    <span className={`badge ${getStatusClass(request.status)}`}>
                                                        {t(request.status?.toLowerCase()) || request.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default Dashboard;

