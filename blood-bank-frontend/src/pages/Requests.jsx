import { useEffect, useState } from "react";
import API from "../services/api";
import AddRequest from "../components/AddRequest";
import EditRequest from "../components/EditRequest";
import DispatchModal from "../components/DispatchModal";
import DispatchReceiptModal from "../components/DispatchReceiptModal";
import { useLanguage } from "../context/LanguageContext";

function Requests() {
    const { t } = useLanguage();

    const [requests, setRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [bloodGroupFilter, setBloodGroupFilter] = useState("All");

    const [dispatchingRequest, setDispatchingRequest] = useState(null);
    const [viewingReceiptIssue, setViewingReceiptIssue] = useState(null);

    // Current user
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

    // Load requests
    const loadRequests = () => {
        API.get("/api/requests")
            .then((response) => {
                setRequests(response.data);
            })
            .catch((error) => {
                console.error("Requests Error:", error);
            });
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const fetchAndShowReceipt = async (requestId) => {
        try {
            const res = await API.get(`/api/blood-issues/by-request/${requestId}`);
            setViewingReceiptIssue(res.data);
        } catch (err) {
            console.error("Receipt fetch error:", err);
            alert("No dispatch receipt found for this request.");
        }
    };

    // Delete request
    const deleteRequest = async (id) => {
        if (!window.confirm(t("confirmDeleteRequest") || "Delete this request?")) {
            return;
        }

        try {
            await API.delete(`/api/requests/${id}`);
            loadRequests();
        } catch (error) {
            console.error(error);
            alert("Unable to delete request");
        }
    };

    // Filter requests
    const filteredRequests = requests.filter((request) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            request.patientName?.toLowerCase().includes(search) ||
            request.hospital?.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === "All" ||
            request.status === statusFilter;

        const matchesBloodGroup =
            bloodGroupFilter === "All" ||
            request.bloodGroup === bloodGroupFilter;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesBloodGroup
        );
    });

    // Status badge
    const getStatusBadge = (status) => {
        const label = t(status?.toLowerCase()) || status;

        if (status === "Pending") {
            return (
                <span className="badge bg-warning text-dark">
                    {label}
                </span>
            );
        }

        if (status === "Approved") {
            return (
                <span className="badge bg-primary">
                    {label}
                </span>
            );
        }

        if (status === "Completed") {
            return (
                <span className="badge bg-success">
                    {label}
                </span>
            );
        }

        if (status === "Rejected") {
            return (
                <span className="badge bg-danger">
                    {label}
                </span>
            );
        }

        return (
            <span className="badge bg-secondary">
                {label}
            </span>
        );
    };

    return (
        <div className="container">
            {/* Page Heading */}
            <div className="my-4">
                <h2 className="mb-1 fw-bold">{t("requestsTitle")}</h2>
                <p className="text-muted mb-0">
                    {t("requestsSubtitle")}
                </p>
            </div>


            {/* Add Request */}

            <AddRequest
                onRequestAdded={loadRequests}
            />


            {/* Request List */}

            <div className="card shadow-sm border-0 mt-4">


                {/* Card Header */}

                <div className="card-header bg-danger text-white">

                    <div className="d-flex justify-content-between align-items-center">

                        <h5 className="mb-0">
                            {t("requestList")}
                        </h5>

                        <span className="badge bg-light text-danger">
                            {filteredRequests.length} {t("requests")}
                        </span>
                    </div>
                </div>

                <div className="card-body">
                    {/* Search and Filters */}
                    <div className="row g-3 mb-4">
                        {/* Search */}
                        <div className="col-12 col-lg-4">
                            <label className="form-label fw-semibold">
                                {t("search")}
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder={t("searchRequestsPlaceholder")}
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                            />
                        </div>

                        {/* Blood Group */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <label className="form-label fw-semibold">
                                {t("bloodGroup")}
                            </label>

                            <select
                                className="form-select"
                                value={bloodGroupFilter}
                                onChange={(e) =>
                                    setBloodGroupFilter(e.target.value)
                                }
                            >
                                <option value="All">{t("allBloodGroups")}</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <label className="form-label fw-semibold">
                                {t("requestStatus")}
                            </label>

                            <select
                                className="form-select"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                            >
                                <option value="All">{t("allStatus")}</option>
                                <option value="Pending">{t("pending")}</option>
                                <option value="Approved">{t("approved")}</option>
                                <option value="Completed">{t("completed")}</option>
                                <option value="Rejected">{t("rejected")}</option>
                            </select>
                        </div>
                    </div>

                    {/* Requests Table */}
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>{t("id")}</th>
                                    <th>{t("patientName")}</th>
                                    <th>{t("bloodGroup")}</th>
                                    <th>{t("unitsRequired")}</th>
                                    <th>{t("hospital")}</th>
                                    <th>{t("status")}</th>
                                    <th>{t("action")}</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredRequests.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-5"
                                        >
                                            <h5 className="text-muted">
                                                {t("noRequestsFound")}
                                            </h5>
                                            <p className="text-muted mb-0">
                                                {t("noRequestsFoundDesc")}
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRequests.map((request) => (
                                        <tr key={request.id}>
                                            {/* ID */}
                                            <td>{request.id}</td>

                                            {/* Patient */}
                                            <td>
                                                <strong>{request.patientName}</strong>
                                            </td>

                                            {/* Blood Group */}
                                            <td>
                                                <span className="badge bg-danger fs-6">
                                                    {request.bloodGroup}
                                                </span>
                                            </td>

                                            {/* Units */}
                                            <td>
                                                <strong>{request.unitsRequired}</strong>
                                                <span className="text-muted ms-1">
                                                    {t("units")}
                                                </span>
                                            </td>

                                            {/* Hospital */}
                                            <td>{request.hospital}</td>

                                            {/* Status */}
                                            <td>
                                                {getStatusBadge(request.status)}
                                            </td>

                                            {/* Actions */}
                                            <td className="text-nowrap">
                                                {/* Dispatch Button for Approved Requests */}
                                                {isAdminOrSuper && request.status?.toLowerCase() === "approved" && (
                                                    <button
                                                        className="btn btn-success btn-sm me-1 fw-semibold"
                                                        onClick={() => setDispatchingRequest(request)}
                                                        title={t("dispatchBlood") || "Dispatch Blood"}
                                                    >
                                                        🚚 {t("dispatch") || "Dispatch"}
                                                    </button>
                                                )}

                                                {/* View Receipt Button for Completed Dispatches */}
                                                {request.status?.toLowerCase() === "completed" && (
                                                    <button
                                                        className="btn btn-outline-primary btn-sm me-1 fw-semibold"
                                                        onClick={() => fetchAndShowReceipt(request.id)}
                                                        title={t("viewReceipt") || "View Receipt"}
                                                    >
                                                        🧾 {t("receipt") || "Slip"}
                                                    </button>
                                                )}

                                                <EditRequest
                                                    request={request}
                                                    onUpdated={loadRequests}
                                                />

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        deleteRequest(request.id)
                                                    }
                                                >
                                                    {t("delete")}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>

            {/* Blood Issue Dispatch Modal */}
            <DispatchModal
                request={dispatchingRequest}
                isOpen={Boolean(dispatchingRequest)}
                onClose={() => setDispatchingRequest(null)}
                onDispatched={(createdIssue) => {
                    loadRequests();
                    setDispatchingRequest(null);
                    setViewingReceiptIssue(createdIssue);
                }}
            />

            {/* Official Dispatch Slip / Receipt Modal */}
            <DispatchReceiptModal
                issue={viewingReceiptIssue}
                isOpen={Boolean(viewingReceiptIssue)}
                onClose={() => setViewingReceiptIssue(null)}
            />

        </div>
    );
}

export default Requests;