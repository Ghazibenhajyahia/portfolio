// ── G.E.N.I.E — Akinator-style identity scanner ────────────────────────────

const GHAZI = {
  name: 'GHAZI BEN HADJ YAHIA',
  tags: ['Full-Stack Dev', 'Designer', 'Laravel', 'Flutter', 'Node.js', 'WordPress', 'Tunisia', 'Freelancer'],
  desc: 'Full-stack developer and designer from Tunisia. Builds web platforms, mobile apps, industrial systems, and freelances in cultural events. Creator of thelandlord.tn, lagora.tn, Secadenordigital SCADA, and more.',
  links: [
    { label: '✉ Email', url: 'mailto:gbhy1919@gmail.com' },
    { label: '⌥ GitHub', url: 'https://github.com/Ghazibenhajyahia' },
    { label: '◈ LinkedIn', url: 'https://www.linkedin.com/in/ghazi-ben-hadj-yahia/' },
    { label: '◉ Instagram', url: 'https://www.instagram.com/ghazi_bhy' },
    { label: '◆ Facebook', url: 'https://www.facebook.com/ghazi.benhadjyahia' },
  ]
};

// Question script — each Q narrows identity. Confidence climbs.
// confidence: added to score on YES, half on MAYBE, 0 on NO (with detour)
const QUESTIONS = [
  {
    q: "Let me scan the neural network... Is your subject a real, living person?",
    sub: "Think of someone. I will find them.",
    conf: 5,
    ai_think: "Initialising scan...",
    detour: "Everyone is real somewhere. Let me recalibrate.",
  },
  {
    q: "Do they work in a professional field — not just a student or hobbyist?",
    conf: 5,
    ai_think: "Filtering database...",
    detour: "Even amateurs become professionals. Adjusting parameters.",
  },
  {
    q: "Does this person create things digitally — software, apps, websites?",
    conf: 8,
    ai_think: "I'm detecting creative energy...",
    detour: "Digital... physical... the lines blur. Updating model.",
  },
  {
    q: "Are they a developer? Someone who writes actual code?",
    conf: 10,
    ai_think: "Code signatures detected in the aura.",
    detour: "Not a coder? But the signal is so strong... Rechecking.",
  },
  {
    q: "Do they also have an eye for design — not just pure backend logic?",
    conf: 10,
    ai_think: "Interesting. A hybrid entity...",
    detour: "Pure logic only? The aesthetic resonance says otherwise.",
  },
  {
    q: "Do they build for the web — websites, web applications?",
    conf: 8,
    ai_think: "Web frequencies confirmed.",
    detour: "Desktop only? Unusual. Narrowing search.",
  },
  {
    q: "Mobile development too? Apps on phones and tablets?",
    conf: 10,
    ai_think: "Multi-platform signature. Very specific.",
    detour: "Web only. The profile is converging differently.",
  },
  {
    q: "I'm sensing PHP in their stack... Do they use a PHP framework like Laravel?",
    conf: 12,
    ai_think: "LARAVEL SIGNATURE DETECTED.",
    detour: "No Laravel? Node, perhaps. Adjusting framework map.",
  },
  {
    q: "And for mobile — do they use Flutter? Google's cross-platform framework?",
    conf: 12,
    ai_think: "Flutter DNA confirmed. This is very distinctive.",
    detour: "React Native? Swift? Updating mobile profile.",
  },
  {
    q: "Are they from Africa? The North Africa region specifically?",
    conf: 10,
    ai_think: "Geo-triangulation in progress...",
    detour: "Europe? Middle East? Expanding geo-radius.",
  },
  {
    q: "Tunisia... Do they operate from Tunisia?",
    conf: 12,
    ai_think: "Coordinates locked. TUNISIA confirmed.",
    detour: "Morocco? Algeria? The Maghreb signal is strong.",
  },
  {
    q: "Beyond coding — do they also freelance in cultural events or experiences?",
    conf: 8,
    ai_think: "Cultural event footprint detected. Multi-disciplinary entity.",
    detour: "Pure tech only. Recalculating personality matrix.",
  },
  {
    q: "One last check. Their portfolio includes something unusual... an industrial SCADA system?",
    conf: 10,
    ai_think: "SCADA. Industrial ERP. Laravel. Tunisia. Flutter. This is...",
    detour: "No SCADA. But everything else fits. Running final analysis.",
  },
];

// ── State ─────────────────────────────────────────────────
let qIdx = 0;
let confidence = 0;
let answered = [];
const MAX_CONF = QUESTIONS.reduce((s, q) => s + q.conf, 0);

// ── DOM refs ──────────────────────────────────────────────
const chatLog   = document.getElementById('chat-log');
const typing    = document.getElementById('typing');
const ansArea   = document.getElementById('answer-area');
const confFill  = document.getElementById('conf-fill');
const confPct   = document.getElementById('conf-pct');
const orbEl     = document.getElementById('ai-orb');
const btnYes    = document.getElementById('btn-yes');
const btnMaybe  = document.getElementById('btn-maybe');
const btnNo     = document.getElementById('btn-no');

// ── Starfield (background canvas) ────────────────────────
const cv = document.getElementById('ak-canvas');
cv.width  = window.innerWidth;
cv.height = window.innerHeight;
const cx  = cv.getContext('2d');
const stars = Array.from({length:180}, () => ({
  x: Math.random() * cv.width, y: Math.random() * cv.height,
  r: Math.random() * 0.9 + 0.2, t: Math.random() * Math.PI * 2
}));
let st = 0;
(function starLoop() {
  cx.fillStyle = '#010508';
  cx.fillRect(0, 0, cv.width, cv.height);
  st += 0.015;
  stars.forEach(s => {
    const a = 0.3 + Math.sin(st + s.t) * 0.25;
    cx.globalAlpha = a;
    cx.fillStyle = '#fff';
    cx.beginPath(); cx.arc(s.x, s.y, s.r, 0, Math.PI * 2); cx.fill();
  });
  cx.globalAlpha = 1;
  requestAnimationFrame(starLoop);
})();

// ── Helpers ───────────────────────────────────────────────
function addMsg(role, text, sub = '') {
  const wrap = document.createElement('div');
  wrap.className = `msg ${role}`;
  wrap.innerHTML = `
    <div class="msg-sender">${role === 'ai' ? 'G.E.N.I.E' : 'YOU'}</div>
    <div class="msg-bubble">${text}</div>
    ${sub ? `<div class="msg-sub">${sub}</div>` : ''}
  `;
  chatLog.appendChild(wrap);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function setButtons(enabled) {
  btnYes.disabled  = !enabled;
  btnMaybe.disabled = !enabled;
  btnNo.disabled   = !enabled;
}

function setConfidence(val) {
  const pct = Math.min(100, Math.round((val / MAX_CONF) * 100));
  confFill.style.width = pct + '%';
  confPct.textContent = pct + '%';
  if (pct > 70) { orbEl.classList.add('confident'); confPct.style.color = '#00ffcc'; }
  if (pct > 50) { orbEl.classList.add('excited'); }
}

async function showTyping(ms = 1200) {
  typing.style.display = 'flex';
  setButtons(false);
  orbEl.classList.add('thinking');
  await delay(ms);
  typing.style.display = 'none';
  orbEl.classList.remove('thinking');
  setButtons(true);
}

const delay = ms => new Promise(r => setTimeout(r, ms));

function orbPulse() {
  orbEl.style.transform = 'scale(1.08)';
  setTimeout(() => orbEl.style.transform = '', 300);
}

// ── Main flow ──────────────────────────────────────────────
async function start() {
  // Intro message
  await showTyping(1500);
  addMsg('ai',
    "I am <strong>G.E.N.I.E</strong> — the Generative Entity Neural Intelligence Engine.<br><br>Think of a person. Don't tell me who. Just answer my questions truthfully and I will identify them.",
    "Warning: I am always right."
  );
  await delay(400);
  askNext();
}

async function askNext() {
  if (qIdx >= QUESTIONS.length) {
    // Enough evidence — go to reveal
    await showTyping(2000);
    addMsg('ai', `I have gathered sufficient evidence. The confidence level is at <strong>${confPct.textContent}</strong>.<br><br>I know exactly who you're thinking of.`, "Preparing final analysis...");
    await delay(1200);
    reveal();
    return;
  }

  const q = QUESTIONS[qIdx];
  await showTyping(900 + Math.random() * 600);
  addMsg('ai', q.q, q.sub || '');
}

async function answer(type) {
  if (qIdx >= QUESTIONS.length) return;
  const q = QUESTIONS[qIdx];

  // User message
  const labels = { yes: 'YES', maybe: 'MAYBE / SOMETIMES', no: 'NO' };
  addMsg('user', labels[type]);
  setButtons(false);

  // Confidence update
  if (type === 'yes') {
    confidence += q.conf;
  } else if (type === 'maybe') {
    confidence += Math.ceil(q.conf / 2);
  }
  setConfidence(confidence);
  orbPulse();
  answered.push({ q: q.q, a: type });
  qIdx++;

  // AI reaction
  await showTyping(700 + Math.random() * 500);

  // Mid-game taunts based on progress
  const pct = Math.round((confidence / MAX_CONF) * 100);
  let reaction = '';
  if (type === 'yes')   reaction = getYesReaction(pct);
  if (type === 'no')    reaction = q.detour || "Interesting... recalibrating.";
  if (type === 'maybe') reaction = "Ambiguous. The signal flickers. I'll account for uncertainty.";

  addMsg('ai', reaction);

  // Early reveal if very confident
  if (pct >= 85) {
    await delay(600);
    await showTyping(1400);
    addMsg('ai', "Wait... I don't need more questions. I already know. The pattern is unmistakable.", "NEURAL LOCK ACHIEVED");
    await delay(800);
    reveal();
    return;
  }

  await delay(300);
  askNext();
}

function getYesReaction(pct) {
  if (pct < 20) return "Good. The dataset grows.";
  if (pct < 35) return "Interesting. I'm narrowing the candidates...";
  if (pct < 50) return "The profile is converging. Distinctly.";
  if (pct < 65) return "I've seen this combination before. Very specific.";
  if (pct < 80) return "The entity is becoming clear. One moment...";
  return "Yes. YES. I see them clearly now. The scan is almost complete.";
}

// ── Reveal ────────────────────────────────────────────────
function reveal() {
  setButtons(false);
  ansArea.style.display = 'none';

  const overlay = document.getElementById('reveal-overlay');
  document.getElementById('reveal-name').textContent = GHAZI.name;
  document.getElementById('reveal-desc').textContent = GHAZI.desc;

  const tags = document.getElementById('reveal-tags');
  tags.innerHTML = GHAZI.tags.map(t => `<span>${t}</span>`).join('');

  const links = document.getElementById('reveal-links');
  links.innerHTML = GHAZI.links.map(l => `<a href="${l.url}" target="_blank">${l.label}</a>`).join('');

  overlay.classList.add('visible');
}

// ── Play again ────────────────────────────────────────────
document.getElementById('play-again').addEventListener('click', () => {
  qIdx = 0; confidence = 0; answered = [];
  chatLog.innerHTML = '';
  confFill.style.width = '0';
  confPct.textContent = '0%';
  confPct.style.color = '';
  orbEl.classList.remove('confident','excited');
  ansArea.style.display = 'flex';
  document.getElementById('reveal-overlay').classList.remove('visible');
  start();
});

// ── Button listeners ──────────────────────────────────────
btnYes.addEventListener('click',   () => answer('yes'));
btnMaybe.addEventListener('click', () => answer('maybe'));
btnNo.addEventListener('click',    () => answer('no'));

// ── Orb eye follows mouse ─────────────────────────────────
const orbPupil = document.getElementById('orb-pupil');
window.addEventListener('mousemove', e => {
  const orb = orbEl.getBoundingClientRect();
  const cx  = orb.left + orb.width / 2;
  const cy  = orb.top + orb.height / 2;
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;
  const dist = Math.min(Math.sqrt(dx*dx+dy*dy), 80);
  const angle = Math.atan2(dy, dx);
  const mx = Math.cos(angle) * dist * 0.04;
  const my = Math.sin(angle) * dist * 0.04;
  orbPupil.style.transform = `translate(${mx}px, ${my}px)`;
});

// ── Start ──────────────────────────────────────────────────
start();
