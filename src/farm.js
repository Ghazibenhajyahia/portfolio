// ── State ─────────────────────────────────────────────────
const res = { bio: 0, spore: 0, crystal: 0 };
const RECIPE = { bio: 4, spore: 4, crystal: 2 };

const entityData = [
  { idx: 0, maxHp: 4, hp: 4, res: 'bio',     respawnMs: 8000  },
  { idx: 1, maxHp: 4, hp: 4, res: 'bio',     respawnMs: 7000  },
  { idx: 2, maxHp: 5, hp: 5, res: 'spore',   respawnMs: 9000  },
  { idx: 3, maxHp: 5, hp: 5, res: 'spore',   respawnMs: 8500  },
  { idx: 4, maxHp: 3, hp: 3, res: 'crystal', respawnMs: 12000 },
  { idx: 5, maxHp: 3, hp: 3, res: 'crystal', respawnMs: 11000 },
];

// ── HUD refs ──────────────────────────────────────────────
const hudBio     = document.getElementById('r-bio');
const hudSpore   = document.getElementById('r-spore');
const hudCrystal = document.getElementById('r-crystal');

function updateHUD() {
  hudBio.textContent     = res.bio;
  hudSpore.textContent   = res.spore;
  hudCrystal.textContent = res.crystal;

  // Update recipe indicators
  document.getElementById('rec-bio').textContent     = `🧬 ${res.bio}/${RECIPE.bio}`;
  document.getElementById('rec-spore').textContent   = `🍄 ${res.spore}/${RECIPE.spore}`;
  document.getElementById('rec-crystal').textContent = `💎 ${res.crystal}/${RECIPE.crystal}`;

  ['bio','spore','crystal'].forEach(r => {
    const el = document.getElementById(`rec-${r}`);
    el.classList.toggle('done', res[r] >= RECIPE[r]);
  });

  // Check if cauldron should be unlocked
  const ready = res.bio >= RECIPE.bio && res.spore >= RECIPE.spore && res.crystal >= RECIPE.crystal;
  const cauldron = document.getElementById('cauldron');
  const btn = document.getElementById('cauldron-btn');
  const hint = document.getElementById('cauldron-hint');

  if (ready) {
    cauldron.style.opacity = '1';
    cauldron.style.pointerEvents = 'auto';
    cauldron.style.borderColor = '#ff88ff';
    hint.textContent = '⚗ CAULDRON READY — MIX NOW';
    hint.style.color = '#ff88ff';
    hint.style.opacity = '1';
  } else {
    const total = Object.values(res).reduce((a,b) => a+b, 0);
    const needed = Object.values(RECIPE).reduce((a,b) => a+b, 0);
    if (total > 0) {
      hint.textContent = `Harvest more resources (${total}/${needed})`;
    }
  }
}

// ── Harvest ───────────────────────────────────────────────
function harvest(idx) {
  const data = entityData[idx];
  if (data.hp <= 0) return;

  data.hp--;
  res[data.res]++;

  // HP bar
  const pct = (data.hp / data.maxHp) * 100;
  document.getElementById(`hp-${idx}`).style.width = pct + '%';

  // Floating number
  spawnFloater(idx, data.res);

  if (data.hp <= 0) {
    depleteEntity(idx, data);
  }

  updateHUD();
}

function depleteEntity(idx, data) {
  const card = document.getElementById(`e${idx}`);
  const btn  = document.querySelector(`.harvest-btn[data-idx="${idx}"]`);
  card.classList.add('depleted');
  btn.disabled = true;

  setTimeout(() => {
    data.hp = data.maxHp;
    document.getElementById(`hp-${idx}`).style.width = '100%';
    card.classList.remove('depleted');
    card.classList.add('respawning');
    btn.disabled = false;
    setTimeout(() => card.classList.remove('respawning'), 700);
  }, data.respawnMs);
}

function spawnFloater(idx, type) {
  const card = document.getElementById(`e${idx}`);
  const rect = card.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = `floater ${type}`;
  const labels = { bio: '+BIO', spore: '+SPORE', crystal: '+CRYSTAL' };
  el.textContent = labels[type];
  el.style.left = (rect.left + rect.width / 2 - 24) + 'px';
  el.style.top  = (rect.top + 30) + 'px';
  document.getElementById('floaters').appendChild(el);
  setTimeout(() => el.remove(), 950);
}

// ── Cauldron ──────────────────────────────────────────────
let brewing = false;

document.getElementById('cauldron-btn').addEventListener('click', () => {
  if (brewing) return;
  if (res.bio < RECIPE.bio || res.spore < RECIPE.spore || res.crystal < RECIPE.crystal) return;

  brewing = true;
  const cauldron = document.getElementById('cauldron');
  cauldron.classList.add('brewing');
  document.getElementById('cauldron-btn').disabled = true;
  document.getElementById('cauldron-btn').textContent = 'BREWING...';

  // Consume resources
  res.bio     -= RECIPE.bio;
  res.spore   -= RECIPE.spore;
  res.crystal -= RECIPE.crystal;
  updateHUD();

  setTimeout(() => {
    cauldron.classList.remove('brewing');
    document.getElementById('tab-overlay').classList.add('visible');
  }, 2800);
});

// ── Consume tab → credits ─────────────────────────────────
document.getElementById('consume-btn').addEventListener('click', () => {
  // White flash then go to credits
  document.body.style.transition = 'opacity .7s';
  document.body.style.opacity = '0';
  setTimeout(() => { window.location.href = 'credits.html'; }, 750);
});

// ── Event delegation for harvest buttons ──────────────────
document.addEventListener('click', e => {
  const btn = e.target.closest('.harvest-btn[data-idx]');
  if (btn && !btn.disabled) harvest(parseInt(btn.dataset.idx));
});

// ── Geo background ────────────────────────────────────────
const geo = document.getElementById('geo-bg');
for (let i = 0; i < 14; i++) {
  const d = document.createElement('div');
  d.style.cssText = `position:absolute;border:1px solid #00ff8812;` +
    `width:${40+Math.random()*150}px;height:${20+Math.random()*100}px;` +
    `top:${Math.random()*100}%;left:${Math.random()*100}%;` +
    `animation:geo-float ${6+Math.random()*6}s ease-in-out ${Math.random()*3}s infinite alternate;` +
    `transform-origin:center;`;
  geo.appendChild(d);
}
