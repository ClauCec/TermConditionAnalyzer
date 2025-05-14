// Multilingual keywords for terms and conditions
const TERMS_KEYWORDS_MULTILINGUAL = {
    en: [
        'terms', 'conditions', 'terms of service', 'terms of use',
        'terms and conditions', 'legal', 'agreement', 'privacy policy',
        'cookie policy', 'user agreement', 'license agreement',
        'terms of sale', 'terms of purchase', 'terms of agreement',
        'terms of engagement', 'terms of reference', 'terms of trade',
        'terms of business', 'terms of contract', 'terms of subscription',
        'terms of membership', 'terms of participation', 'terms of access',
        'terms of license', 'terms of warranty', 'terms of guarantee',
        'terms of return', 'terms of refund', 'terms of cancellation',
        'terms of termination', 'terms of renewal'
    ],
    de: [
        'bedingungen', 'nutzungsbedingungen', 'agb', 'allgemeine geschäftsbedingungen',
        'geschäftsbedingungen', 'nutzungsvereinbarung', 'lizenzvereinbarung',
        'datenschutzrichtlinie', 'cookie-richtlinie', 'benutzervereinbarung',
        'rechtliche hinweise', 'vertragsbedingungen', 'kaufbedingungen',
        'verkaufsbedingungen', 'teilnahmebedingungen', 'zugangsbedingungen',
        'lizenzbedingungen', 'garantiebedingungen', 'rückgabebedingungen',
        'erstattungsbedingungen', 'kündigungsbedingungen', 'verlängerungsbedingungen'
    ],
    fr: [
        'conditions', 'termes', 'conditions d\'utilisation', 'conditions générales',
        'conditions générales d\'utilisation', 'conditions de service',
        'politique de confidentialité', 'politique de cookies',
        'accord d\'utilisation', 'licence d\'utilisation', 'mentions légales',
        'conditions de vente', 'conditions d\'achat', 'conditions d\'accord',
        'conditions d\'engagement', 'conditions de référence', 'conditions commerciales',
        'conditions d\'affaires', 'conditions de contrat', 'conditions d\'abonnement',
        'conditions d\'adhésion', 'conditions de participation', 'conditions d\'accès',
        'conditions de licence', 'conditions de garantie', 'conditions de retour',
        'conditions de remboursement', 'conditions d\'annulation', 'conditions de résiliation',
        'conditions de renouvellement'
    ],
    es: [
        'términos', 'condiciones', 'términos de servicio', 'términos de uso',
        'términos y condiciones', 'legal', 'acuerdo', 'política de privacidad',
        'política de cookies', 'acuerdo de usuario', 'licencia de uso',
        'términos de venta', 'términos de compra', 'términos de acuerdo',
        'términos de participación', 'términos de referencia', 'términos comerciales',
        'términos de negocio', 'términos de contrato', 'términos de suscripción',
        'términos de membresía', 'términos de participación', 'términos de acceso',
        'términos de licencia', 'términos de garantía', 'términos de devolución',
        'términos de reembolso', 'términos de cancelación', 'términos de terminación',
        'términos de renovación'
    ],
    it: [
        'termini', 'condizioni', 'termini di servizio', 'termini di utilizzo',
        'termini e condizioni', 'legale', 'accordo', 'informativa sulla privacy',
        'politica dei cookie', 'accordo utente', 'licenza d\'uso',
        'termini di vendita', 'termini di acquisto', 'termini di accordo',
        'termini di partecipazione', 'termini di riferimento', 'termini commerciali',
        'termini di business', 'termini di contratto', 'termini di abbonamento',
        'termini di appartenenza', 'termini di partecipazione', 'termini di accesso',
        'termini di licenza', 'termini di garanzia', 'termini di reso',
        'termini di rimborso', 'termini di cancellazione', 'termini di risoluzione',
        'termini di rinnovo'
    ]
};

// Function to check if text contains terms-related keywords in any supported language
function containsTermsKeywords(text) {
    const lowerText = text.toLowerCase();
    return Object.values(TERMS_KEYWORDS_MULTILINGUAL).some(keywords =>
        keywords.some(keyword => lowerText.includes(keyword))
    );
}

// Function to detect the language of the text
function detectLanguage(text) {
    const lowerText = text.toLowerCase();
    const languageMatches = {};

    // Check each language's keywords
    Object.entries(TERMS_KEYWORDS_MULTILINGUAL).forEach(([lang, keywords]) => {
        languageMatches[lang] = keywords.filter(keyword => lowerText.includes(keyword)).length;
    });

    // Return the language with the most matches
    return Object.entries(languageMatches)
        .sort(([, a], [, b]) => b - a)[0][0];
}

// Function to find terms and conditions links
function findTermsLinks() {
    const links = Array.from(document.getElementsByTagName('a'));
    return links.filter(link => {
        const linkText = link.textContent.toLowerCase();
        const href = link.href.toLowerCase();
        return containsTermsKeywords(linkText) || containsTermsKeywords(href);
    }).map(link => ({
        element: link,
        language: detectLanguage(link.textContent)
    }));
}

// Function to find terms and conditions in text content
function findTermsContent() {
    const paragraphs = Array.from(document.getElementsByTagName('p'));
    return paragraphs.filter(p => containsTermsKeywords(p.textContent))
        .map(p => ({
            element: p,
            language: detectLanguage(p.textContent)
        }));
}

// Function to find terms in headings
function findTermsInHeadings() {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    return headings.filter(h => containsTermsKeywords(h.textContent))
        .map(h => ({
            element: h,
            language: detectLanguage(h.textContent)
        }));
}

// Function to find terms in meta tags
function findTermsInMetaTags() {
    const metaTags = Array.from(document.getElementsByTagName('meta'));
    return metaTags.filter(meta => 
        (meta.name && containsTermsKeywords(meta.name)) ||
        (meta.content && containsTermsKeywords(meta.content))
    ).map(meta => ({
        element: meta,
        language: detectLanguage(meta.content || meta.name)
    }));
}

// Function to find terms in footer
function findTermsInFooter() {
    const footer = document.querySelector('footer');
    if (footer) {
        return Array.from(footer.querySelectorAll('a, p'))
            .filter(el => containsTermsKeywords(el.textContent))
            .map(el => ({
                element: el,
                language: detectLanguage(el.textContent)
            }));
    }
    return [];
}

// Main detection function
function detectTermsAndConditions() {
    const termsLinks = findTermsLinks();
    const termsContent = findTermsContent();
    const termsHeadings = findTermsInHeadings();
    const termsMeta = findTermsInMetaTags();
    const termsFooter = findTermsInFooter();
    
    if (termsLinks.length > 0 || termsContent.length > 0 || 
        termsHeadings.length > 0 || termsMeta.length > 0 || 
        termsFooter.length > 0) {
        
        // Send message to background script
        chrome.runtime.sendMessage({
            action: 'termsDetected',
            data: {
                links: termsLinks.map(({ element, language }) => ({
                    text: element.textContent.trim(),
                    url: element.href,
                    language
                })),
                content: termsContent.map(({ element, language }) => ({
                    text: element.textContent.trim(),
                    language
                })),
                headings: termsHeadings.map(({ element, language }) => ({
                    text: element.textContent.trim(),
                    language
                })),
                meta: termsMeta.map(({ element, language }) => ({
                    name: element.name,
                    content: element.content,
                    language
                })),
                footer: termsFooter.map(({ element, language }) => ({
                    text: element.textContent.trim(),
                    language
                }))
            }
        });
    }
}

// Run detection when page loads
detectTermsAndConditions();

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageContent') {
        // Get all text content from the page
        const content = document.body.innerText;
        sendResponse({ content });
    }
}); 