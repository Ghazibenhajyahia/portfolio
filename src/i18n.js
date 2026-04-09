// ── Translations ──────────────────────────────────────────
export const translations = {
  en: {
    // blackhole
    'bh-hint':     '[ TAP A PLANET TO DECRYPT ]',
    'bh-back':     '← RETURN TO SURFACE',
    // enigma
    'en-stamp':    '⚠ RESTRICTED ZONE — SECTOR Ω ⚠',
    'en-back':     '← EVACUATE',
    'en-speech':   "You've entered the core. Solve my riddles to learn who I am.",
    'en-score-label': 'DECRYPTED',
    'en-header':   '[ENCRYPTED FILES — AWAITING DECRYPTION]',
    'en-q0':       'I speak in functions, breathe in loops, and build things no one can touch but everyone uses. What am I?',
    'en-q1':       'I orbit the black hole closest. Click me and you can reach my creator. Which planet am I?',
    'en-q2':       'Three of my projects share the same engine. WordPress. Name any one of them (domain only).',
    'en-q3':       'DECODE THIS → 07 08 01 26 09',
    'en-q3sub':    '(A=01, B=02 ... Z=26. The word describes what I do with code.)',
    'en-q4':       'My designation is GBH-Ω-7749-ARCHITECT. What country am I operating from?',
    'en-win-stamp':'✓ FULLY DECRYPTED',
    'en-win-title':'IDENTITY CONFIRMED',
    'en-win-body': 'GHAZI BEN HADJ YAHIA<br>Full-Stack Developer · Designer · Builder<br>Tunisia, North Africa',
    'en-win-link1':'RETURN TO PORTFOLIO',
    'en-win-link2':'BACK TO THE VOID',
    // main
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
    // blackhole
    'bh-hint':     '[ APPUYEZ SUR UNE PLANÈTE POUR DÉCRYPTER ]',
    'bh-back':     '← RETOURNER À LA SURFACE',
    // enigma
    'en-stamp':    '⚠ ZONE RESTREINTE — SECTEUR Ω ⚠',
    'en-back':     '← ÉVACUER',
    'en-speech':   "Vous avez pénétré le noyau. Résolvez mes énigmes pour découvrir qui je suis.",
    'en-score-label': 'DÉCRYPTÉ',
    'en-header':   '[FICHIERS CHIFFRÉS — EN ATTENTE DE DÉCRYPTAGE]',
    'en-q0':       'Je parle en fonctions, je respire en boucles, et je construis ce que personne ne peut toucher mais que tout le monde utilise. Que suis-je ?',
    'en-q1':       'J\'orbite le plus près du trou noir. Cliquez sur moi pour contacter mon créateur. Quelle planète suis-je ?',
    'en-q2':       'Trois de mes projets partagent le même moteur. WordPress. Nommez-en un (domaine uniquement).',
    'en-q3':       'DÉCODEZ CECI → 07 08 01 26 09',
    'en-q3sub':    '(A=01, B=02 ... Z=26. Le mot décrit ce que je fais avec le code.)',
    'en-q4':       'Mon identifiant est GBH-Ω-7749-ARCHITECT. De quel pays est-ce que j\'opère ?',
    'en-win-stamp':'✓ ENTIÈREMENT DÉCRYPTÉ',
    'en-win-title':'IDENTITÉ CONFIRMÉE',
    'en-win-body': 'GHAZI BEN HADJ YAHIA<br>Développeur Full-Stack · Designer · Créateur<br>Tunisie, Afrique du Nord',
    'en-win-link1':'RETOUR AU PORTFOLIO',
    'en-win-link2':'RETOUR AU VIDE',
    // main
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
