import { useLanguage } from "../context/LanguageContext";
import { API_BASE_URL } from "../services/api";

function DispatchReceiptModal({ issue, isOpen, onClose }) {
    const { t } = useLanguage();

    if (!isOpen || !issue) {
        return null;
    }

    const handlePrint = () => {
        window.print();
    };

    const handleOpenReceiptTab = () => {
        window.open(`${API_BASE_URL}/api/blood-issues/${issue.id}/receipt`, "_blank");
    };

    return (
        <div
            className="modal d-block fade show"
            tabIndex="-1"
            style={{
                backgroundColor: "rgba(15, 23, 42, 0.75)",
                backdropFilter: "blur(4px)",
                zIndex: 1060
            }}
        >
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    {/* Modal Header */}
                    <div className="modal-header bg-danger text-white py-3">
                        <div className="d-flex align-items-center gap-2">
                            <span className="fs-4">🧾</span>
                            <h5 className="modal-title fw-bold mb-0">
                                {t("receipt") || "Blood Bank Dispatch Slip"}
                            </h5>
                        </div>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>

                    {/* Printable Receipt Body */}
                    <div className="modal-body p-4 bg-white" id="printable-receipt">
                        {/* Header Banner */}
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                            <div>
                                <h4 className="fw-bold text-danger mb-0 d-flex align-items-center gap-2">
                                    <span>🩸</span> {t("appName") || "Blood Connect"}
                                </h4>
                                <small className="text-muted">
                                    Central Healthcare Blood Bank & Distribution Facility
                                </small>
                            </div>
                            <div className="text-end">
                                <span className="badge bg-danger-subtle text-danger border border-danger fw-bold px-3 py-1">
                                    OFFICIAL DISPATCH
                                </span>
                                <div className="font-monospace fw-bold text-danger mt-1">
                                    {issue.issueNumber}
                                </div>
                            </div>
                        </div>

                        {/* Information Grid */}
                        <div className="row g-3 mb-4">
                            <div className="col-12 col-md-6">
                                <div className="p-3 bg-light rounded-3 h-100 border-start border-danger border-4">
                                    <div className="text-muted small text-uppercase fw-bold mb-1">
                                        {t("patientName") || "Patient Name"}
                                    </div>
                                    <div className="fw-bold fs-6 text-dark">
                                        {issue.patientName}
                                    </div>
                                    <small className="text-muted">
                                        Linked Request #{issue.requestId}
                                    </small>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="p-3 bg-light rounded-3 h-100 border-start border-danger border-4">
                                    <div className="text-muted small text-uppercase fw-bold mb-1">
                                        {t("hospital") || "Destination Hospital"}
                                    </div>
                                    <div className="fw-bold fs-6 text-dark">
                                        {issue.hospital}
                                    </div>
                                    <small className="text-muted">
                                        Doctor: {issue.doctorName || "Attending Physician"}
                                    </small>
                                </div>
                            </div>

                            <div className="col-6 col-md-3">
                                <div className="p-3 bg-light rounded-3 text-center border">
                                    <div className="text-muted small text-uppercase fw-bold mb-1">
                                        {t("bloodGroup")}
                                    </div>
                                    <span className="badge bg-danger fs-5 px-3 py-1">
                                        {issue.bloodGroup}
                                    </span>
                                </div>
                            </div>

                            <div className="col-6 col-md-3">
                                <div className="p-3 bg-light rounded-3 text-center border">
                                    <div className="text-muted small text-uppercase fw-bold mb-1">
                                        Units Dispatched
                                    </div>
                                    <span className="fw-bold fs-4 text-success">
                                        {issue.unitsIssued} {t("units") || "Units"}
                                    </span>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="p-3 bg-light rounded-3 border">
                                    <div className="text-muted small text-uppercase fw-bold mb-1">
                                        {t("recipientName") || "Collected By"}
                                    </div>
                                    <div className="fw-bold text-dark">
                                        {issue.recipientName}
                                    </div>
                                    <small className="text-muted">
                                        Phone: {issue.recipientPhone}
                                    </small>
                                </div>
                            </div>
                        </div>

                        {/* Dispatch Metadata & Remarks */}
                        <div className="row g-3 mb-4">
                            <div className="col-12 col-md-6">
                                <small className="text-muted d-block">
                                    <strong>{t("issuedAt") || "Date & Time"}:</strong>{" "}
                                    {issue.issuedAt ? new Date(issue.issuedAt).toLocaleString() : ""}
                                </small>
                                <small className="text-muted d-block">
                                    <strong>{t("issuedBy") || "Issued By Staff"}:</strong> {issue.issuedBy}
                                </small>
                            </div>
                            {issue.remarks && (
                                <div className="col-12 col-md-6">
                                    <small className="text-muted d-block">
                                        <strong>{t("dispatchRemarks") || "Remarks"}:</strong> {issue.remarks}
                                    </small>
                                </div>
                            )}
                        </div>

                        {/* Dual Signature Section */}
                        <div className="row pt-4 mt-4 border-top text-center">
                            <div className="col-6">
                                <div style={{ height: "40px" }}></div>
                                <div className="border-top pt-2 mx-auto" style={{ maxWidth: "220px" }}>
                                    <small className="fw-bold text-dark d-block">
                                        {issue.issuedBy}
                                    </small>
                                    <small className="text-muted">
                                        Authorized Staff Signature & Stamp
                                    </small>
                                </div>
                            </div>

                            <div className="col-6">
                                <div style={{ height: "40px" }}></div>
                                <div className="border-top pt-2 mx-auto" style={{ maxWidth: "220px" }}>
                                    <small className="fw-bold text-dark d-block">
                                        {issue.recipientName}
                                    </small>
                                    <small className="text-muted">
                                        Hospital Collector Signature
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="modal-footer bg-light py-2 justify-content-between">
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleOpenReceiptTab}
                        >
                            🌐 Open Printable Web Receipt
                        </button>

                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-danger btn-sm fw-bold px-3"
                                onClick={handlePrint}
                            >
                                🖨️ {t("printReceipt") || "Print Slip"}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={onClose}
                            >
                                {t("close")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DispatchReceiptModal;
