import { useLanguage } from "../context/LanguageContext";

function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="bg-dark text-light py-4 mt-5 border-top border-danger border-3">
            <div className="container">
                <div className="row align-items-center gy-3">
                    <div className="col-12 col-md-6 text-center text-md-start">
                        <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
                            <span className="fs-5">🩸</span>
                            <span className="fw-bold fs-5">{t("appName")}</span>
                        </div>
                        <p className="text-secondary small mb-0">
                            {t("footerText")}
                        </p>
                    </div>
                    <div className="col-12 col-md-6 text-center text-md-end">
                        <p className="text-secondary small mb-1">
                            Final-Year Computer Science & Engineering Project
                        </p>
                        <p className="text-secondary small mb-0">
                            © {new Date().getFullYear()} Blood Bank Management System. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
