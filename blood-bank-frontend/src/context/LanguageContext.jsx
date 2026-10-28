import { createContext, useContext, useState, useEffect } from "react";
import translations from "../pages/utils/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(
        localStorage.getItem("language") || "en"
    );

    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    useEffect(() => {
        // Show welcome modal on first visit if no language has been explicitly selected
        const languageSelected = localStorage.getItem("languageSelected");
        if (!languageSelected) {
            setShowWelcomeModal(true);
        }
    }, []);

    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
        localStorage.setItem("language", newLanguage);
    };

    const confirmLanguage = (chosenLanguage) => {
        setLanguage(chosenLanguage);
        localStorage.setItem("language", chosenLanguage);
        localStorage.setItem("languageSelected", "true");
        setShowWelcomeModal(false);
    };

    const openWelcomeModal = () => {
        setShowWelcomeModal(true);
    };

    const closeWelcomeModal = () => {
        localStorage.setItem("languageSelected", "true");
        setShowWelcomeModal(false);
    };

    const t = (key) => {
        return (
            translations[language]?.[key] ||
            translations["en"]?.[key] ||
            key
        );
    };

    return (
        <LanguageContext.Provider
            value={{
                language,
                changeLanguage,
                confirmLanguage,
                showWelcomeModal,
                openWelcomeModal,
                closeWelcomeModal,
                t
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}