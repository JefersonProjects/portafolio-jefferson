import { education, certifications, languages } from "../data/education.js";
import { createEducationCard } from "../components/EducationCard.js";
import { createCertificationsCard } from "../components/CertificationsCard.js";

/**
 * Sección "Formación": estudios a la izquierda, certificaciones e idiomas a la derecha.
 * Para editar el contenido usa únicamente js/data/education.js.
 */
export function initEducationSection() {
    const container = document.getElementById("education-container");
    if (!container) return;

    container.replaceChildren(
        ...education.map(createEducationCard),
        createCertificationsCard(certifications, languages)
    );
}
