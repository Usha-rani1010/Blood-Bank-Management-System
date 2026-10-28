import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";

function WelcomeLanguageModal() {
    const {
        language,
        showWelcomeModal,
        confirmLanguage,
        closeWelcomeModal,
        t
    } = useLanguage();

    const [selected, setSelected] = useState(language || "en");

    if (!showWelcomeModal) {
        return null;
    }

    const languages = [
        {
            code: "en",
            label: "English",
            sublabel: "English",
            greeting: "Welcome to Blood Bank Management System",
            subgreeting: "Choose English to continue"
        },
        {
            code: "te",
            label: "తెలుగు",
            sublabel: "Telugu",
            greeting: "బ్లడ్ బ్యాంక్ మేనేజ్‌మెంట్ సిస్టమ్‌కు స్వాగతం",
            subgreeting: "కొనసాగడానికి తెలుగును ఎంచుకోండి"
        },
        {
            code: "hi",
            label: "हिन्दी",
            sublabel: "Hindi",
            greeting: "ब्लड बैंक प्रबंधन प्रणाली में आपका स्वागत है",
            subgreeting: "आगे बढ़ने के लिए हिन्दी चुनें"
        }
    ];

    const currentLangObj = languages.find((l) => l.code === selected) || languages[0];

    const handleContinue = () => {
        confirmLanguage(selected);
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
                    {/* Header with Blood Bank Healthcare Theme */}
                    <div className="bg-danger text-white text-center py-4 px-3 position-relative">
                        <button
                            type="button"
                            className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
                            onClick={closeWelcomeModal}
                            aria-label="Close"
                        ></button>

                        <div className="display-4 mb-2">🩸</div>
                        <h3 className="fw-bold mb-1">{currentLangObj.greeting}</h3>
                        <p className="mb-0 text-white-50">{t("welcomeSubtitle")}</p>
                    </div>

                    <div className="modal-body p-4 p-md-5 bg-white">
                        <div className="text-center mb-4">
                            <h5 className="fw-bold text-dark mb-1">{t("chooseLanguage")}</h5>
                            <p className="text-muted small">
                                Select your preferred language. You can easily change this anytime from the navigation bar.
                            </p>
                        </div>

                        {/* Language Selection Grid */}
                        <div className="row g-3 mb-4">
                            {languages.map((item) => {
                                const isSelected = selected === item.code;
                                return (
                                    <div className="col-12 col-md-4" key={item.code}>
                                        <div
                                            className={`card h-100 p-3 text-center border-2 rounded-3 cursor-pointer transition-all ${
                                                isSelected
                                                    ? "border-danger bg-danger-subtle shadow-sm"
                                                    : "border-light-subtle bg-light"
                                            }`}
                                            style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                                            onClick={() => setSelected(item.code)}
                                        >
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="badge bg-secondary-subtle text-dark small">
                                                    {item.sublabel}
                                                </span>
                                                {isSelected && (
                                                    <span className="badge bg-danger rounded-circle p-1">✓</span>
                                                )}
                                            </div>
                                            <h4 className="fw-bold mb-1 text-dark">{item.label}</h4>
                                            <small className="text-muted">{item.subgreeting}</small>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Continue Button */}
                        <div className="d-grid gap-2">
                            <button
                                type="button"
                                className="btn btn-danger btn-lg py-3 fw-bold shadow-sm rounded-3"
                                onClick={handleContinue}
                            >
                                {t("continue")} →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeLanguageModal;
