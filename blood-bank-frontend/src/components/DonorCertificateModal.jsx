import { useState } from "react";
import API from "../services/api";
import { useLanguage } from "../context/LanguageContext";

function DonorCertificateModal({ donor, isOpen, onClose, onUpdated, user }) {
    const { t } = useLanguage();

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [reviewing, setReviewing] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [previewLoading, setPreviewLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: "", text: "" });

    if (!isOpen || !donor) {
        return null;
    }

    const isAdminOrSuper = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

    // Handle File Selection with Client-Side Validation
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) {
            setFile(null);
            return;
        }

        // Validate max 5MB
        if (selected.size > 5 * 1024 * 1024) {
            setFeedback({
                type: "danger",
                text: "File size exceeds the 5MB limit. Please choose a smaller document."
            });
            setFile(null);
            e.target.value = "";
            return;
        }

        // Validate MIME type
        const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
        if (!allowed.includes(selected.type.toLowerCase())) {
            setFeedback({
                type: "danger",
                text: "Invalid format. Only PDF, JPG, or PNG files are accepted."
            });
            setFile(null);
            e.target.value = "";
            return;
        }

        setFeedback({ type: "", text: "" });
        setFile(selected);
    };

    // Upload Certificate
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setFeedback({ type: "warning", text: "Please select a file to upload." });
            return;
        }

        setUploading(true);
        setFeedback({ type: "", text: "" });

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await API.post(`/api/donors/${donor.id}/certificate`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setFeedback({
                type: "success",
                text: "Certificate uploaded successfully! It is now pending verification review."
            });
            setFile(null);
            if (onUpdated) {
                onUpdated(response.data);
            }
        } catch (error) {
            console.error("Upload error:", error);
            setFeedback({
                type: "danger",
                text: error.response?.data?.message || "Failed to upload certificate. Please try again."
            });
        } finally {
            setUploading(false);
        }
    };

    // Download / View Certificate
    const handleViewCertificate = async () => {
        setPreviewLoading(true);
        try {
            const response = await API.get(`/api/donors/${donor.id}/certificate`, {
                responseType: "blob"
            });

            const blob = new Blob([response.data], {
                type: donor.certificateContentType || "application/octet-stream"
            });
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch (error) {
            console.error("View certificate error:", error);
            setFeedback({
                type: "danger",
                text: "Unable to retrieve certificate document."
            });
        } finally {
            setPreviewLoading(false);
        }
    };

    // Admin Review (Verify, Reject, Resubmit)
    const handleReview = async (newStatus) => {
        if ((newStatus === "REJECTED" || newStatus === "RESUBMISSION_REQUIRED") && !rejectionReason.trim()) {
            setFeedback({
                type: "warning",
                text: "Please provide a reason or correction notes before rejecting or requesting resubmission."
            });
            return;
        }

        setReviewing(true);
        setFeedback({ type: "", text: "" });

        try {
            const response = await API.put(`/api/donors/${donor.id}/verification`, {
                status: newStatus,
                rejectionReason: rejectionReason.trim()
            });

            setFeedback({
                type: "success",
                text: `Verification status updated to ${newStatus}!`
            });
            setRejectionReason("");
            if (onUpdated) {
                onUpdated(response.data);
            }
        } catch (error) {
            console.error("Review error:", error);
            setFeedback({
                type: "danger",
                text: error.response?.data?.message || "Failed to update verification status."
            });
        } finally {
            setReviewing(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "VERIFIED":
                return <span className="badge bg-success px-3 py-2 fs-6">✓ {t("verified")}</span>;
            case "PENDING":
                return <span className="badge bg-warning text-dark px-3 py-2 fs-6">⏳ {t("pendingReview")}</span>;
            case "UNDER_REVIEW":
                return <span className="badge bg-info text-dark px-3 py-2 fs-6">🔍 {t("inReview")}</span>;
            case "REJECTED":
                return <span className="badge bg-danger px-3 py-2 fs-6">✕ {t("rejected")}</span>;
            case "RESUBMISSION_REQUIRED":
                return <span className="badge bg-warning text-dark px-3 py-2 fs-6">⚠️ {t("resubmissionRequired")}</span>;
            default:
                return <span className="badge bg-secondary px-3 py-2 fs-6">⚪ {t("unverified")}</span>;
        }
    };

    const formatBytes = (bytes) => {
        if (!bytes) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    };

    return (
        <div
            className="modal d-block fade show"
            tabIndex="-1"
            style={{
                backgroundColor: "rgba(15, 23, 42, 0.7)",
                backdropFilter: "blur(4px)",
                zIndex: 1055
            }}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    {/* Header */}
                    <div className="modal-header bg-danger text-white py-3">
                        <div className="d-flex align-items-center gap-2">
                            <span className="fs-4">📋</span>
                            <div>
                                <h5 className="modal-title fw-bold mb-0">
                                    {t("certificateTitle")}
                                </h5>
                                <small className="text-white-50">
                                    {donor.name} • {t("bloodGroup")}: <strong>{donor.bloodGroup}</strong>
                                </small>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    <div className="modal-body p-4">
                        {/* Feedback Banner */}
                        {feedback.text && (
                            <div className={`alert alert-${feedback.type} alert-dismissible fade show`} role="alert">
                                {feedback.text}
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setFeedback({ type: "", text: "" })}
                                ></button>
                            </div>
                        )}

                        {/* Donor Details Card */}
                        <div className="card border-0 bg-light rounded-3 p-3 mb-4">
                            <div className="row g-2 align-items-center">
                                <div className="col-12 col-md-6">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="badge bg-danger fs-5 px-3 py-2">
                                            {donor.bloodGroup}
                                        </div>
                                        <div>
                                            <h5 className="mb-0 fw-bold">{donor.name}</h5>
                                            <small className="text-muted">
                                                {donor.city} • {donor.phone} • {donor.email}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 text-md-end mt-2 mt-md-0">
                                    <div className="small text-muted mb-1">{t("status")}:</div>
                                    {getStatusBadge(donor.verificationStatus)}
                                </div>
                            </div>
                        </div>

                        {/* Document Status Section */}
                        <div className="mb-4">
                            <h6 className="fw-bold text-dark border-bottom pb-2">
                                📑 Document Status & Details
                            </h6>

                            {donor.certificateFilename ? (
                                <div className="border rounded-3 p-3 bg-white">
                                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                        <div>
                                            <div className="fw-bold text-dark">
                                                📎 {donor.certificateOriginalFilename || "Proof Certificate"}
                                            </div>
                                            <small className="text-muted d-block">
                                                {formatBytes(donor.certificateSize)} • {donor.certificateContentType}
                                            </small>
                                            {donor.certificateUploadedAt && (
                                                <small className="text-muted d-block">
                                                    {t("uploadedOn")}: {new Date(donor.certificateUploadedAt).toLocaleString()}
                                                </small>
                                            )}
                                            {donor.verifiedBy && (
                                                <small className="text-success fw-semibold d-block mt-1">
                                                    {t("verifiedByOn")}: {donor.verifiedBy} (
                                                    {donor.verifiedAt ? new Date(donor.verifiedAt).toLocaleDateString() : ""}
                                                    )
                                                </small>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm px-3 fw-semibold"
                                            onClick={handleViewCertificate}
                                            disabled={previewLoading}
                                        >
                                            {previewLoading ? t("loading") : `🔍 ${t("viewCertificate")}`}
                                        </button>
                                    </div>

                                    {/* Rejection Note Alert */}
                                    {donor.rejectionReason && (
                                        <div className="alert alert-danger mt-3 mb-0 py-2 small">
                                            <strong>{t("rejectionReason")}:</strong> {donor.rejectionReason}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted bg-light rounded-3">
                                    <p className="mb-0">{t("noCertificateUploaded")}</p>
                                    <small className="text-muted">
                                        Upload a valid lab report or blood donor card to verify this donor.
                                    </small>
                                </div>
                            )}
                        </div>

                        {/* Upload Form */}
                        <div className="mb-4">
                            <h6 className="fw-bold text-dark border-bottom pb-2">
                                📤 {donor.certificateFilename ? "Replace Proof Document" : t("uploadCertificate")}
                            </h6>
                            <p className="small text-muted mb-3">
                                {t("certificateUploadHelp")}
                            </p>

                            <form onSubmit={handleUpload}>
                                <div className="input-group">
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-danger fw-semibold px-4"
                                        disabled={!file || uploading}
                                    >
                                        {uploading ? t("loading") : t("uploadCertificate")}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Admin / Super Admin Review Section */}
                        {isAdminOrSuper && donor.certificateFilename && (
                            <div className="border rounded-3 p-3 bg-danger-subtle border-danger-subtle">
                                <h6 className="fw-bold text-danger mb-2">
                                    🛡️ Staff Verification Decision
                                </h6>
                                <p className="small text-muted mb-3">
                                    Inspect the donor's uploaded lab report. Verify that the declared blood group (
                                    <strong>{donor.bloodGroup}</strong>) exactly matches the laboratory result before approving.
                                </p>

                                <div className="mb-3">
                                    <label className="form-label small fw-semibold text-dark">
                                        {t("rejectionReason")} (Required if rejecting or requesting resubmission):
                                    </label>
                                    <textarea
                                        className="form-control form-control-sm"
                                        rows="2"
                                        placeholder={t("rejectionReasonPlaceholder")}
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        disabled={reviewing}
                                    ></textarea>
                                </div>

                                <div className="d-flex flex-wrap gap-2 justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => handleReview("RESUBMISSION_REQUIRED")}
                                        disabled={reviewing}
                                    >
                                        ⚠️ {t("requestResubmission")}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleReview("REJECTED")}
                                        disabled={reviewing}
                                    >
                                        ✕ {t("rejectVerification")}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-success btn-sm px-3 fw-bold"
                                        onClick={() => handleReview("VERIFIED")}
                                        disabled={reviewing}
                                    >
                                        ✓ {t("approveVerification")}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="modal-footer bg-light py-2">
                        <button type="button" className="btn btn-secondary btn-sm px-4" onClick={onClose}>
                            {t("close")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DonorCertificateModal;
