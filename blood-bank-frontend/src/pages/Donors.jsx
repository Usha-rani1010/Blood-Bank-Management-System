import { useEffect, useState } from "react";
import API from "../services/api";
import AddDonor from "../components/AddDonor";
import EditDonor from "../components/EditDonor";
import DonorCertificateModal from "../components/DonorCertificateModal";
import { useLanguage } from "../context/LanguageContext";

function Donors() {
    const { t } = useLanguage();

    const [donors, setDonors] = useState([]);
    const [selectedDonor, setSelectedDonor] = useState(null);
    const [certificateDonor, setCertificateDonor] = useState(null);

    // Get current logged-in user
    let user = null;
    try {
        const stored = localStorage.getItem("user");
        if (stored) {
            user = JSON.parse(stored);
        }
    } catch {
        user = null;
    }

    // Search and filter
    const [searchTerm, setSearchTerm] = useState("");
    const [bloodGroupFilter, setBloodGroupFilter] = useState("All");
    const [verificationFilter, setVerificationFilter] = useState("All");

    const loadDonors = () => {
        API.get("/api/donors")
            .then((response) => {
                setDonors(response.data);
            })
            .catch((error) => {
                console.error("Donors Error:", error);
            });
    };

    useEffect(() => {
        loadDonors();
    }, []);

    // Delete donor
    const deleteDonor = async (id) => {
        if (!window.confirm(t("confirmDeleteDonor") || "Delete this donor?")) {
            return;
        }

        try {
            await API.delete(`/api/donors/${id}`);
            loadDonors();
        } catch (error) {
            console.error(error);
            alert("Unable to delete donor");
        }
    };

    // Edit donor
    const handleEdit = (donor) => {
        setSelectedDonor(donor);
    };

    // Filter donors
    const filteredDonors = donors.filter((donor) => {
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            donor.name?.toLowerCase().includes(search) ||
            donor.phone?.toLowerCase().includes(search) ||
            donor.city?.toLowerCase().includes(search) ||
            donor.email?.toLowerCase().includes(search);

        const matchesBloodGroup =
            bloodGroupFilter === "All" ||
            donor.bloodGroup === bloodGroupFilter;

        const matchesVerification =
            verificationFilter === "All" ||
            donor.verificationStatus === verificationFilter;

        return matchesSearch && matchesBloodGroup && matchesVerification;
    });

    const getVerificationBadge = (donor) => {
        const status = donor.verificationStatus || "NOT_SUBMITTED";
        switch (status) {
            case "VERIFIED":
                return (
                    <span
                        className="badge bg-success-subtle text-success border border-success cursor-pointer"
                        style={{ cursor: "pointer" }}
                        onClick={() => setCertificateDonor(donor)}
                        title="Click to view verified certificate"
                    >
                        ✓ {t("verified")}
                    </span>
                );
            case "PENDING":
                return (
                    <span
                        className="badge bg-warning-subtle text-warning-emphasis border border-warning cursor-pointer"
                        style={{ cursor: "pointer" }}
                        onClick={() => setCertificateDonor(donor)}
                        title="Document uploaded - awaiting review"
                    >
                        ⏳ {t("pendingReview")}
                    </span>
                );
            case "UNDER_REVIEW":
                return (
                    <span
                        className="badge bg-info-subtle text-info-emphasis border border-info cursor-pointer"
                        style={{ cursor: "pointer" }}
                        onClick={() => setCertificateDonor(donor)}
                    >
                        🔍 {t("inReview")}
                    </span>
                );
            case "REJECTED":
                return (
                    <span
                        className="badge bg-danger-subtle text-danger border border-danger cursor-pointer"
                        style={{ cursor: "pointer" }}
                        onClick={() => setCertificateDonor(donor)}
                        title={donor.rejectionReason || "Verification rejected"}
                    >
                        ✕ {t("rejected")}
                    </span>
                );
            case "RESUBMISSION_REQUIRED":
                return (
                    <span
                        className="badge bg-warning-subtle text-dark border border-warning cursor-pointer"
                        style={{ cursor: "pointer" }}
                        onClick={() => setCertificateDonor(donor)}
                    >
                        ⚠️ {t("resubmissionRequired")}
                    </span>
                );
            default:
                return (
                    <span
                        className="badge bg-light text-muted border cursor-pointer"
                        style={{ cursor: "pointer" }}
                        onClick={() => setCertificateDonor(donor)}
                        title="No certificate uploaded. Click to upload."
                    >
                        ⚪ {t("unverified")}
                    </span>
                );
        }
    };

    return (
        <div className="container">
            {/* Page Heading */}
            <div className="my-4">
                <h2 className="mb-1 fw-bold">{t("donorManagement")}</h2>
                <p className="text-muted mb-0">
                    {t("manageRegisteredDonors")}
                </p>
            </div>

            {/* Add Donor */}
            <AddDonor
                onDonorAdded={loadDonors}
            />


            {/* Edit Donor */}

            {selectedDonor && (

                <EditDonor
                    donor={selectedDonor}

                    onUpdated={() => {
                        loadDonors();
                        setSelectedDonor(null);
                    }}

                    onCancel={() => {
                        setSelectedDonor(null);
                    }}
                />

            )}


            {/* Donor List */}

            <div className="card shadow-sm border-0 mt-4">

                <div className="card-header bg-danger text-white">

                    <div className="d-flex justify-content-between align-items-center">

                        <h5 className="mb-0">
                            {t("registeredDonorsList")}
                        </h5>

                        <span className="badge bg-light text-danger">
                            {filteredDonors.length} {t("donors")}
                        </span>

                    </div>

                </div>

                <div className="card-body">
                    {/* Search and Filter */}
                    <div className="row g-3 mb-4">
                        {/* Search */}
                        <div className="col-12 col-md-5">
                            <label className="form-label fw-semibold">
                                {t("searchDonors")}
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder={t("searchDonorsPlaceholder")}
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                            />
                        </div>

                        {/* Blood Group Filter */}
                        <div className="col-12 col-md-3">
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
                                <option value="All">
                                    {t("allBloodGroups")}
                                </option>
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

                        {/* Verification Filter */}
                        <div className="col-12 col-md-4">
                            <label className="form-label fw-semibold">
                                {t("statusFilterVerification")}
                            </label>

                            <select
                                className="form-select"
                                value={verificationFilter}
                                onChange={(e) =>
                                    setVerificationFilter(e.target.value)
                                }
                            >
                                <option value="All">{t("allVerificationStatuses")}</option>
                                <option value="VERIFIED">✓ {t("verified")}</option>
                                <option value="PENDING">⏳ {t("pendingReview")}</option>
                                <option value="UNDER_REVIEW">🔍 {t("inReview")}</option>
                                <option value="REJECTED">✕ {t("rejected")}</option>
                                <option value="RESUBMISSION_REQUIRED">⚠️ {t("resubmissionRequired")}</option>
                                <option value="NOT_SUBMITTED">⚪ {t("unverified")}</option>
                            </select>
                        </div>
                    </div>

                    {/* Donor Table */}
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>{t("id")}</th>
                                    <th>{t("name")}</th>
                                    <th>{t("age")}</th>
                                    <th>{t("gender")}</th>
                                    <th>{t("bloodGroup")}</th>
                                    <th>{t("phone")}</th>
                                    <th>{t("city")}</th>
                                    <th>{t("verification")}</th>
                                    <th>{t("action")}</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredDonors.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="text-center py-5"
                                        >
                                            <div className="text-muted">
                                                <h5>
                                                    {t("noDonorsFound")}
                                                </h5>
                                                <p className="mb-0">
                                                    {t("noDonorsFoundDesc")}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDonors.map((donor) => (
                                        <tr key={donor.id}>
                                            {/* ID */}
                                            <td>{donor.id}</td>

                                            {/* Name */}
                                            <td>
                                                <strong>{donor.name}</strong>
                                            </td>

                                            {/* Age */}
                                            <td>{donor.age}</td>

                                            {/* Gender */}
                                            <td>
                                                <span className="badge bg-secondary">
                                                    {donor.gender === "Male" ? t("male") : donor.gender === "Female" ? t("female") : donor.gender}
                                                </span>
                                            </td>

                                            {/* Blood Group */}
                                            <td>
                                                <span className="badge bg-danger fs-6">
                                                    {donor.bloodGroup}
                                                </span>
                                            </td>

                                            {/* Phone */}
                                            <td>{donor.phone}</td>

                                            {/* City */}
                                            <td>{donor.city}</td>

                                            {/* Verification Status Badge */}
                                            <td>
                                                {getVerificationBadge(donor)}
                                            </td>

                                            {/* Actions */}
                                            <td className="text-nowrap">
                                                <button
                                                    className="btn btn-warning btn-sm me-1"
                                                    onClick={() =>
                                                        handleEdit(donor)
                                                    }
                                                >
                                                    {t("edit")}
                                                </button>

                                                <button
                                                    className="btn btn-outline-danger btn-sm me-1"
                                                    onClick={() =>
                                                        setCertificateDonor(donor)
                                                    }
                                                    title={t("uploadCertificate")}
                                                >
                                                    📋 {t("uploadCertificate")}
                                                </button>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        deleteDonor(donor.id)
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

            {/* Donor Certificate Modal */}
            <DonorCertificateModal
                donor={certificateDonor}
                isOpen={Boolean(certificateDonor)}
                onClose={() => setCertificateDonor(null)}
                onUpdated={(updated) => {
                    loadDonors();
                    setCertificateDonor(updated);
                }}
                user={user}
            />

        </div>
    );
}

export default Donors;
