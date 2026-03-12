import * as THREE from 'three';

// ── Renderer ──────────────────────────────────────────────
const canvas = document.getElementById('bh-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000008);

// ── Scene ─────────────────────────────────────────────────
const scene = new THREE.Scene();

// Camera: 40° above XZ plane for clear 3D disk view
const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 800);
camera.position.set(0, 14, 18);
camera.lookAt(0, 0, 0);

// ── Background stars ──────────────────────────────────────
{
  const g = new THREE.BufferGeometry();
  const p = new Float32Array(8000 * 3);
  for (let i = 0; i < p.length; i++) p[i] = (Math.random() - 0.5) * 500;
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({
    color: 0xffffff, size: 0.05, transparent: true, opacity: 0.6,
    sizeAttenuation: true
  })));
}

// ── Black Hole: dark sphere + glow shells ─────────────────
const BH_R = 2.4;

scene.add(new THREE.Mesh(
  new THREE.SphereGeometry(BH_R, 64, 64),
  new THREE.MeshBasicMaterial({ color: 0x000000 })
));

// Inner orange glow (back-face, larger sphere)
scene.add(new THREE.Mesh(
  new THREE.SphereGeometry(BH_R * 1.18, 64, 64),
  new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.20, side: THREE.BackSide })
));
// Outer wide glow
scene.add(new THREE.Mesh(
  new THREE.SphereGeometry(BH_R * 1.55, 64, 64),
  new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.07, side: THREE.BackSide })
));

// ── Accretion Disk (additive blending — glows!) ───────────
function makeDiskBand(rMin, rMax, count, color, size, opacity) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const angles = new Float32Array(count);
  const radii = new Float32Array(count);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    angles[i] = Math.random() * Math.PI * 2;
    radii[i] = rMin + Math.random() * (rMax - rMin);
    speeds[i] = 0.018 / Math.pow(radii[i], 1.5); // Kepler r^1.5
    const ySpread = (1 - (radii[i] - rMin) / (rMax - rMin)) * 0.25;
    pos[i * 3]     = Math.cos(angles[i]) * radii[i];
    pos[i * 3 + 1] = (Math.random() - 0.5) * ySpread;
    pos[i * 3 + 2] = Math.sin(angles[i]) * radii[i];
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  const mat = new THREE.PointsMaterial({
    color, size, transparent: true, opacity,
    blending: THREE.AdditiveBlending, // ← THIS makes it glow
    depthWrite: false,
    sizeAttenuation: true
  });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
  return { geo, angles, radii, speeds, count };
}

const diskBands = [
  makeDiskBand(BH_R + 0.2, BH_R + 1.1, 1200, 0xffcc00, 0.08, 0.95),  // inner hot ring
  makeDiskBand(BH_R + 1.1, BH_R + 2.2,  900, 0xff8800, 0.06, 0.75),
  makeDiskBand(BH_R + 2.2, BH_R + 3.8,  600, 0xff4400, 0.05, 0.55),
  makeDiskBand(BH_R + 3.8, BH_R + 6.0,  350, 0xdd2200, 0.04, 0.30),
];

// ── Planets ───────────────────────────────────────────────
const PLANETS = [
  {
    name: 'CONTACT',     color: 0xff3366, r: 0.42, orbitR: 8.5,  phase: 0,              yOff: 0.3,
    info: { title: '[FILE_04 — ESTABLISH CONTACT]',
      html: `<ul>
      <li><a href="mailto:gbhy1919@gmail.com">✉ gbhy1919@gmail.com</a></li>
      <li><a href="https://github.com/Ghazibenhajyahia" target="_blank">⌥ github.com/Ghazibenhajyahia</a></li>
      <li><a href="https://www.linkedin.com/in/ghazi-ben-hadj-yahia/" target="_blank">◈ LinkedIn</a></li>
      <li><a href="https://www.instagram.com/ghazi_bhy" target="_blank">◉ Instagram @ghazi_bhy</a></li>
      <li><a href="https://www.facebook.com/ghazi.benhadjyahia" target="_blank">◆ Facebook</a></li>
      </ul>
      <br><p style="opacity:.5;font-size:.72rem">Available for freelance, collabs, interesting problems.</p>` }
  },
  {
    name: 'PROJECTS',    color: 0x4499ff, r: 0.68, orbitR: 11.0, phase: Math.PI * 0.4,  yOff: -0.4,
    info: { title: '[FILE_02 — OPERATIONS]',
      html: `<ul>
      <li><a href="https://lagora.tn" target="_blank">lagora.tn</a> — WordPress marketplace</li>
      <li><a href="https://thelandlord.tn" target="_blank">thelandlord.tn</a> — Flutter + Node.js app</li>
      <li><a href="https://manager.thelandlord.tn" target="_blank">manager.thelandlord.tn</a> — PMS (Laravel)</li>
      <li>Secadenordigital SCADA — Industrial ERP (Laravel)</li>
      <li><a href="https://envirofest.tn" target="_blank">envirofest.tn</a> — Festival platform</li>
      <li><a href="https://conciergetunisie.thelandlord.tn" target="_blank">conciergetunisie</a> — Concierge</li></ul>` }
  },
  {
    name: 'SKILLS',      color: 0x00dd66, r: 0.52, orbitR: 13.5, phase: Math.PI * 0.8,  yOff: 0.5,
    info: { title: '[FILE_03 — CAPABILITIES]',
      html: `<div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.5rem">
      ${['Laravel','Flutter','Node.js','WordPress','Three.js','MySQL','PostgreSQL','UI/UX Design','Figma','Git']
        .map(s=>`<span class="tag">${s}</span>`).join('')}</div>` }
  },
  {
    name: 'ABOUT',       color: 0xffcc00, r: 0.58, orbitR: 16.0, phase: Math.PI * 1.2,  yOff: -0.5,
    info: { title: '[FILE_01 — IDENTITY]',
      html: `<p>Full-stack developer specializing in web and mobile. Fluent in Laravel, Flutter, Node.js, WordPress. Designs his own work. Freelances in cultural events when the stars align.</p>
      <br><p style="opacity:.6;font-size:.75rem">Name: Ghazi Ben Hadj Yahia · Origin: Tunisia · Classification: CLASS-7</p>` }
  },
  {
    name: '???',         color: 0xaa00ff, r: 0.30, orbitR: 19.0, phase: Math.PI * 1.7,  yOff: 0.7,
    info: { title: '⚠ SIGNAL ENCRYPTED ⚠',
      html: `<p>You weren't supposed to find this.</p>
      <br><p style="font-family:monospace;color:#00ff88;font-size:.8rem">ENTITY: GBH-Ω-7749-ARCHITECT<br>
      THREAT LEVEL: ■■■■■ CREATIVE<br>STATUS: ● ACTIVE</p>
      <br><p style="opacity:.4;font-size:.65rem">DOCUMENT #XF-2749 · EYES ONLY</p>` }
  }
];

// Kepler: ω ∝ 1/r^1.5 — slow, majestic, realistic
PLANETS.forEach(p => { p.speed = 3.5 / Math.pow(p.orbitR, 1.5); });

// Build planet meshes — store index for raycasting
const planetMeshes = [];
const planetData = new Map();

PLANETS.forEach((pd, idx) => {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(pd.r, 48, 48),
    new THREE.MeshStandardMaterial({
      color: pd.color, emissive: new THREE.Color(pd.color).multiplyScalar(0.15),
      metalness: 0.1, roughness: 0.65
    })
  );
  scene.add(mesh);
  planetMeshes.push(mesh);
  planetData.set(mesh.id, pd);

  // Additive glow halo around planet
  const halo = new THREE.Points(
    (() => { const g = new THREE.BufferGeometry();
      const p2 = new Float32Array(80 * 3);
      for (let i = 0; i < 80; i++) {
        const a = Math.random() * Math.PI * 2, b = Math.random() * Math.PI;
        const rr = pd.r * (1.2 + Math.random() * 0.6);
        p2[i*3] = rr * Math.sin(b) * Math.cos(a);
        p2[i*3+1] = rr * Math.sin(b) * Math.sin(a);
        p2[i*3+2] = rr * Math.cos(b);
      } g.setAttribute('position', new THREE.BufferAttribute(p2, 3)); return g; })(),
    new THREE.PointsMaterial({ color: pd.color, size: 0.08, transparent: true, opacity: 0.35,
      blending: THREE.AdditiveBlending, depthWrite: false })
  );
  mesh.add(halo);
  mesh.add(new THREE.PointLight(pd.color, 0.8, 8));
});

// Orbit trail rings
PLANETS.forEach(pd => {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(pd.orbitR, 0.012, 3, 220),
    new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.05,
      blending: THREE.AdditiveBlending })
  );
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
});

// ── Lights ────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x112244, 2.5));
const bhLight = new THREE.PointLight(0xff6600, 2.5, 35);
scene.add(bhLight);

// ── HTML Labels ───────────────────────────────────────────
const labels = PLANETS.map(pd => {
  const el = document.createElement('div');
  el.className = 'planet-label';
  el.textContent = pd.name;
  document.body.appendChild(el);
  return el;
});

// ── Raycaster ─────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function getHitPlanet(e) {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  // Only test planet meshes directly (not children)
  const hits = raycaster.intersectObjects(planetMeshes, false);
  return hits.length > 0 ? planetData.get(hits[0].object.id) : null;
}

window.addEventListener('mousemove', e => {
  document.body.style.cursor = getHitPlanet(e) ? 'pointer' : '';
});

window.addEventListener('click', e => {
  if (e.target.closest('.planet-card') || e.target.id === 'planet-modal') return;
  const pd = getHitPlanet(e);
  if (pd) showPlanetModal(pd);
});

// ── Modal ─────────────────────────────────────────────────
function showPlanetModal(pd) {
  document.getElementById('planet-modal-title').textContent = pd.info.title;
  document.getElementById('planet-modal-body').innerHTML = pd.info.html;
  document.getElementById('planet-modal').classList.add('visible');
}
window.closePlanetModal = () => document.getElementById('planet-modal').classList.remove('visible');
document.addEventListener('click', e => { if (e.target.id === 'planet-modal') window.closePlanetModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closePlanetModal(); });

// ── Animate ───────────────────────────────────────────────
let time = 0;
const tmp = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);
  time += 0.008;

  // Disk particles
  diskBands.forEach(({ geo, angles, radii, speeds, count }) => {
    const pos = geo.attributes.position;
    for (let i = 0; i < count; i++) {
      angles[i] += speeds[i];
      pos.setX(i, Math.cos(angles[i]) * radii[i]);
      pos.setZ(i, Math.sin(angles[i]) * radii[i]);
    }
    pos.needsUpdate = true;
  });

  // Planets
  planetMeshes.forEach((mesh, i) => {
    const pd = PLANETS[i];
    const a = time * pd.speed + pd.phase;
    mesh.position.set(
      Math.cos(a) * pd.orbitR,
      pd.yOff + Math.sin(time * 0.25 + i * 1.3) * 0.35,
      Math.sin(a) * pd.orbitR
    );
    mesh.rotation.y = time * 0.3;

    // Screen-space label
    tmp.copy(mesh.position).project(camera);
    labels[i].style.left = ((tmp.x * 0.5 + 0.5) * window.innerWidth) + 'px';
    labels[i].style.top  = (-(tmp.y * 0.5 - 0.5) * window.innerHeight - pd.r * 55 - 6) + 'px';
    labels[i].style.display = tmp.z < 1 ? 'block' : 'none';
  });

  // Gentle camera orbit — slowly circles the scene
  camera.position.x = Math.sin(time * 0.03) * 5;
  camera.position.z = 18 + Math.cos(time * 0.03) * 3;
  camera.position.y = 14 + Math.sin(time * 0.04) * 1.5;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
