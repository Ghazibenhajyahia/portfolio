// ── Translations ──────────────────────────────────────────
export const translations = {
  en: {
    classified:    'CLASSIFIED',
    subtitle:      'Full-Stack Developer · Designer · Builder',
    scroll:        '▼ SCROLL TO DECRYPT ▼',
    aki:           '◈ WHO AM I?',
    file01:        '[FILE_01 — IDENTITY]',
    about:         'About',
    'about-text':  'Full-stack developer specializing in web and mobile. Fluent in Laravel, Flutter, Node.js, and WordPress. I design my work too. Freelance in cultural events when the stars align.',
    file02:        '[FILE_02 — OPERATIONS]',
    projects:      'Projects',
    'p-lagora':    'Web platform and marketplace.',
    'p-tll':       'Mobile app — full stack Flutter & Node.js.',
    'p-manager':   'Property Management System.',
    'p-scada':     'Industrial ERP/SCADA system.',
    'p-enviro':    'Environmental festival platform.',
    'p-concierge': 'Concierge service platform.',
    file03:        '[FILE_03 — CAPABILITIES]',
    skills:        'Skills',
    file04:        '[FILE_04 — ESTABLISH CONTACT]',
    contact:       'Contact',
    'contact-text':'Available for freelance, collaborations, and interesting problems.',
  },
  fr: {
    classified:    'CLASSIFIÉ',
    subtitle:      'Développeur Full-Stack · Designer · Créateur',
    scroll:        '▼ DÉFILER POUR DÉCRYPTER ▼',
    aki:           '◈ QUI SUIS-JE ?',
    file01:        '[DOSSIER_01 — IDENTITÉ]',
    about:         'À Propos',
    'about-text':  'Développeur full-stack spécialisé en web et mobile. Expert en Laravel, Flutter, Node.js et WordPress. Je conçois également mes propres interfaces. Freelance en événements culturels quand les astres s\'alignent.',
    file02:        '[DOSSIER_02 — OPÉRATIONS]',
    projects:      'Projets',
    'p-lagora':    'Plateforme web et marketplace.',
    'p-tll':       'Application mobile — Flutter & Node.js full stack.',
    'p-manager':   'Système de gestion immobilière.',
    'p-scada':     'Système ERP/SCADA industriel.',
    'p-enviro':    'Plateforme de festival environnemental.',
    'p-concierge': 'Plateforme de service de conciergerie.',
    file03:        '[DOSSIER_03 — COMPÉTENCES]',
    skills:        'Compétences',
    file04:        '[DOSSIER_04 — ÉTABLIR LE CONTACT]',
    contact:       'Contact',
    'contact-text':'Disponible pour du freelance, des collaborations et des projets intéressants.',
  }
};

// ── State ─────────────────────────────────────────────────
let currentLang = localStorage.getItem('portfolio-lang') || 'en';

// ── Apply translations ─────────────────────────────────────
export function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('portfolio-lang', lang);
  const t = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  const btn = document.getElementById('lang-btn');
  if (btn) btn.textContent = lang === 'en' ? 'FR' : 'EN';
  document.documentElement.lang = lang;
}

// ── Toggle ─────────────────────────────────────────────────
export function toggleLang() {
  applyLang(currentLang === 'en' ? 'fr' : 'en');
}

// ── Init ───────────────────────────────────────────────────
export function initI18n() {
  applyLang(currentLang); // apply saved/default on load

  const btn = document.getElementById('lang-btn');
  if (btn) btn.addEventListener('click', toggleLang);
}
