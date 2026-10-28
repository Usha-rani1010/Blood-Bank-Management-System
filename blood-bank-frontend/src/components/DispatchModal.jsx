import { useState } from "react";
import API from "../services/api";
import { useLanguage } from "../context/LanguageContext";

function DispatchModal({ request, isOpen, onClose, onDispatched }) {
    const { t } = useLanguage();

    const [doctorName, setDoctorName] = useState("");
    const [recipientName, setRecipientName] = useState("");
    const [recipientPhone, setRecipientPhone] = useState("");
    const [remarks, setRemarks] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen || !request) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!recipientName.trim()) {
            setError("Recipient / Collector name is required");
            return;
        }

        if (!recipientPhone.trim() || !/^\d{10}$/.test(recipientPhone.trim())) {
            setError("Recipient contact phone must contain exactly 10 digits");
            return;
        }

        setSubmitting(true);
        try {
            const payload = {
                requestId: request.id,
                doctorName: doctorName.trim(),
                recipientName: recipientName.trim(),
                recipientPhone: recipientPhone.trim(),
                remarks: remarks.trim()
            };

            const response = await API.post("/api/blood-issues/dispatch", payload);

            // Reset form
            setDoctorName("");
            setRecipientName("");
            setRecipientPhone("");
            setRemarks("");

            if (onDispatched) {
                onDispatched(response.data);
            }
        } catch (err) {
            console.error("Dispatch error:", err);
            setError(err.response?.data?.message || err.response?.data?.error || "Failed to dispatch blood units. Please try again.");
        } finally {
            setSubmitting(false);
        }
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
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    {/* Header */}
                    <div className="modal-header bg-danger text-white py-3">
                        <div className="d-flex align-items-center gap-2">
                            <span className="fs-4">🚚</span>
                            <div>
                                <h5 className="modal-title fw-bold mb-0">
                                    {t("dispatchBlood") || "Dispatch Blood Units"}
                                </h5>
                                <small className="text-white-50">
                                    Request #{request.id} • {request.patientName}
                                </small>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                            aria-label="Close"
                            disabled={submitting}
                        ></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            {error && (
                                <div className="alert alert-danger py-2 small mb-3">
                                    {error}
                                </div>
                            )}

                            {/* Request Summary Card */}
                            <div className="card border-0 bg-light p-3 rounded-3 mb-3">
                                <div className="row g-2 text-center text-md-start">
                                    <div className="col-6 col-md-3">
                                        <div className="text-muted small">{t("bloodGroup")}</div>
                                        <span className="badge bg-danger fs-6 px-3 py-1">
                                            {request.bloodGroup}
                                        </span>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="text-muted small">{t("unitsRequired")}</div>
                                        <strong className="fs-6 text-dark">{request.unitsRequired} {t("units")}</strong>
                                    </div>
                                    <div className="col-12 col-md-6 mt-2 mt-md-0">
                                        <div className="text-muted small">{t("hospital")}</div>
                                        <strong className="text-dark small d-block text-truncate">
                                            {request.hospital}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="mb-3">
                                <label className="form-label small fw-semibold">
                                    {t("doctorName") || "Prescribing Doctor / Physician"}
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Dr. Rajesh Kumar, MD"
                                    value={doctorName}
                                    onChange={(e) => setDoctorName(e.target.value)}
                                    disabled={submitting}
                                />
                            </div>

                            <div className="row g-2 mb-3">
                                <div className="col-12 col-md-6">
                                    <label className="form-label small fw-semibold">
                                        {t("recipientName") || "Collector / Recipient Name"} <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Full name of collector"
                                        value={recipientName}
                                        onChange={(e) => setRecipientName(e.target.value)}
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <label className="form-label small fw-semibold">
                                        {t("recipientPhone") || "Collector Contact Phone"} <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        placeholder="10 digit mobile #"
                                        value={recipientPhone}
                                        onChange={(e) => setRecipientPhone(e.target.value)}
                                        maxLength="10"
                                        required
                                        disabled={submitting}
                                    />
                                </div>
                            </div>

                            <div className="mb-2">
                                <label className="form-label small fw-semibold">
                                    {t("dispatchRemarks") || "Transport / Storage Remarks"}
                                </label>
                                <textarea
                                    className="form-control"
                                    rows="2"
                                    placeholder="Cold chain container ID, ice pack verified, temperature reading..."
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    disabled={submitting}
                                ></textarea>
                            </div>
                        </div>

                        <div className="modal-footer bg-light py-2">
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={onClose}
                                disabled={submitting}
                            >
                                {t("cancel")}
                            </button>
                            <button
                                type="submit"
                                className="btn btn-danger btn-sm fw-bold px-4"
                                disabled={submitting}
                            >
                                {submitting ? t("loading") : `🚚 ${t("confirmDispatch") || "Confirm & Generate Slip"}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DispatchModal;
