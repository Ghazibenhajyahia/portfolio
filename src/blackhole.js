import * as THREE from 'three';

// ── Renderer ──────────────────────────────────────────────
const canvas = document.getElementById('bh-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000008);

// ── Scene ─────────────────────────────────────────────────
const scene = new THREE.Scene();

// ── Camera: 3/4 top-down view so disk reads as ellipse ────
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 600);
camera.position.set(0, 16, 20);
camera.lookAt(0, 0, 0);

// ── Stars (background) ────────────────────────────────────
const starGeo = new THREE.BufferGeometry();
const starPts = new Float32Array(7000 * 3);
for (let i = 0; i < starPts.length; i++) starPts[i] = (Math.random() - 0.5) * 400;
starGeo.setAttribute('position', new THREE.BufferAttribute(starPts, 3));
scene.add(new THREE.Points(starGeo,
  new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.7 })
));

// ── Black Hole (3D sphere with glow layers) ───────────────
// Innermost: pure black
const bhCore = new THREE.Mesh(
  new THREE.SphereGeometry(2.2, 64, 64),
  new THREE.MeshBasicMaterial({ color: 0x000000 })
);
scene.add(bhCore);

// Glow shell 1 — deep orange halo
const glow1 = new THREE.Mesh(
  new THREE.SphereGeometry(2.6, 64, 64),
  new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.15, side: THREE.BackSide })
);
scene.add(glow1);

// Glow shell 2 — wider faint halo
const glow2 = new THREE.Mesh(
  new THREE.SphereGeometry(3.4, 64, 64),
  new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.06, side: THREE.BackSide })
);
scene.add(glow2);

// ── Accretion Disk (particle ring, flat in XZ plane) ──────
const DISK_BANDS = [
  { rMin: 2.5, rMax: 3.4, count: 800,  color: 0xffaa00, size: 0.065, opacity: 1.0 },
  { rMin: 3.4, rMax: 4.5, count: 700,  color: 0xff6600, size: 0.055, opacity: 0.8 },
  { rMin: 4.5, rMax: 6.0, count: 500,  color: 0xff3300, size: 0.045, opacity: 0.6 },
  { rMin: 6.0, rMax: 8.5, count: 300,  color: 0xdd2200, size: 0.035, opacity: 0.35 },
];

const diskParticles = DISK_BANDS.map(band => {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(band.count * 3);
  const angles = new Float32Array(band.count);
  const radii = new Float32Array(band.count);
  const speeds = new Float32Array(band.count);
  for (let i = 0; i < band.count; i++) {
    angles[i] = Math.random() * Math.PI * 2;
    radii[i] = band.rMin + Math.random() * (band.rMax - band.rMin);
    speeds[i] = 0.018 / Math.sqrt(radii[i]); // Kepler
    pos[i * 3]     = Math.cos(angles[i]) * radii[i];
    pos[i * 3 + 1] = (Math.random() - 0.5) * 0.18; // thin disk
    pos[i * 3 + 2] = Math.sin(angles[i]) * radii[i];
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({
    color: band.color, size: band.size, transparent: true, opacity: band.opacity
  }));
  scene.add(pts);
  return { pts, geo, angles, radii, speeds, count: band.count };
});

// ── Planets ───────────────────────────────────────────────
// Speed: Kepler normalized — closer = faster
function kSpeed(r) { return 0.38 / Math.sqrt(r); }

const PLANETS = [
  {
    name: 'CONTACT',
    color: 0xff3366,
    emissive: 0x330011,
    radius: 0.42,
    orbitR: 7.0,
    phase: 0,
    yOffset: 0.4,
    info: {
      title: '[FILE_04 — ESTABLISH CONTACT]',
      html: `<ul>
        <li><a href="mailto:gbhy1919@gmail.com">gbhy1919@gmail.com</a></li>
        <li><a href="https://github.com/Ghazibenhajyahia" target="_blank">github.com/Ghazibenhajyahia</a></li>
      </ul><br><p style="opacity:.5;font-size:.72rem">Available for freelance, collabs, and interesting problems.</p>`
    }
  },
  {
    name: 'PROJECTS',
    color: 0x4499ff,
    emissive: 0x001133,
    radius: 0.68,
    orbitR: 9.5,
    phase: Math.PI * 0.4,
    yOffset: -0.5,
    info: {
      title: '[FILE_02 — OPERATIONS]',
      html: `<ul>
        <li><a href="https://lagora.tn" target="_blank">lagora.tn</a> — WordPress marketplace</li>
        <li><a href="https://thelandlord.tn" target="_blank">thelandlord.tn</a> — Flutter + Node.js mobile app</li>
        <li><a href="https://manager.thelandlord.tn" target="_blank">manager.thelandlord.tn</a> — PMS (Laravel)</li>
        <li>Secadenordigital SCADA — Industrial ERP (Laravel)</li>
        <li><a href="https://envirofest.tn" target="_blank">envirofest.tn</a> — Environmental festival</li>
        <li><a href="https://conciergetunisie.thelandlord.tn" target="_blank">conciergetunisie</a> — Concierge platform</li>
      </ul>`
    }
  },
  {
    name: 'SKILLS',
    color: 0x00dd66,
    emissive: 0x002211,
    radius: 0.52,
    orbitR: 12.0,
    phase: Math.PI * 0.8,
    yOffset: 0.6,
    info: {
      title: '[FILE_03 — CAPABILITIES]',
      html: `<div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.5rem">
        ${['Laravel','Flutter','Node.js','WordPress','Three.js','MySQL','PostgreSQL','UI/UX Design','Figma','Git']
          .map(s => `<span class="tag">${s}</span>`).join('')}
      </div>`
    }
  },
  {
    name: 'ABOUT',
    color: 0xffcc00,
    emissive: 0x221100,
    radius: 0.58,
    orbitR: 14.5,
    phase: Math.PI * 1.2,
    yOffset: -0.3,
    info: {
      title: '[FILE_01 — IDENTITY]',
      html: `<p>Full-stack developer specializing in web and mobile. Fluent in Laravel, Flutter, Node.js, and WordPress. Designs his own work. Freelances in cultural events when the stars align.</p>
      <br><p style="opacity:.6;font-size:.75rem">Designation: Ghazi Ben Hadj Yahia<br>Origin: Tunisia, North Africa<br>Classification: CLASS-7 COGNITIVE ENTITY</p>`
    }
  },
  {
    name: '???',
    color: 0xaa00ff,
    emissive: 0x110033,
    radius: 0.30,
    orbitR: 17.0,
    phase: Math.PI * 1.7,
    yOffset: 0.8,
    info: {
      title: '⚠ SIGNAL ENCRYPTED ⚠',
      html: `<p>You weren't supposed to find this.</p>
      <br><p style="font-family:monospace;color:#00ff88;font-size:.8rem">
      ENTITY: GBH-Ω-7749-ARCHITECT<br>
      THREAT LEVEL: ■■■■■ CREATIVE<br>
      KNOWN ABILITIES: Full-stack engineering · Design · Cultural infiltration<br>
      STATUS: ● ACTIVE — MONITORING</p>
      <br><p style="opacity:.4;font-size:.65rem">DOCUMENT #XF-2749 · EYES ONLY</p>`
    }
  }
];

PLANETS.forEach(p => { p.orbitSpeed = kSpeed(p.orbitR); });

const planetMeshes = [];
PLANETS.forEach(p => {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(p.radius, 48, 48),
    new THREE.MeshStandardMaterial({
      color: p.color,
      emissive: p.emissive,
      metalness: 0.15,
      roughness: 0.6,
    })
  );
  mesh.userData = p;
  scene.add(mesh);
  planetMeshes.push(mesh);

  // Atmosphere glow
  mesh.add(new THREE.Mesh(
    new THREE.SphereGeometry(p.radius * 1.4, 32, 32),
    new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: 0.08, side: THREE.BackSide })
  ));

  // Planet glow light
  mesh.add(new THREE.PointLight(p.color, 0.7, 7));
});

// Orbit trail rings (flat, faint)
PLANETS.forEach(p => {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(p.orbitR, 0.015, 3, 200),
    new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.07 })
  );
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);
});

// ── Lighting ──────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x111133, 2.0));
scene.add(Object.assign(new THREE.PointLight(0xff6600, 2.0, 25), { position: new THREE.Vector3(0, 0, 0) }));

// ── HTML Labels ───────────────────────────────────────────
const labels = PLANETS.map(p => {
  const el = document.createElement('div');
  el.className = 'planet-label';
  el.textContent = p.name;
  document.body.appendChild(el);
  return el;
});

// ── Raycaster ─────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', e => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  document.body.style.cursor = raycaster.intersectObjects(planetMeshes, true).length > 0 ? 'pointer' : '';
});

window.addEventListener('click', e => {
  if (e.target.closest('.planet-card') || e.target.id === 'planet-modal') return;
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(planetMeshes, true);
  if (hits.length > 0) {
    let obj = hits[0].object;
    while (obj && !obj.userData.info) obj = obj.parent;
    if (obj?.userData.info) showPlanetModal(obj.userData);
  }
});

// ── Modal ─────────────────────────────────────────────────
function showPlanetModal(data) {
  document.getElementById('planet-modal-title').textContent = data.info.title;
  document.getElementById('planet-modal-body').innerHTML = data.info.html;
  document.getElementById('planet-modal').classList.add('visible');
}
window.closePlanetModal = () => document.getElementById('planet-modal').classList.remove('visible');
document.addEventListener('click', e => { if (e.target.id === 'planet-modal') window.closePlanetModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closePlanetModal(); });

// ── Animation loop ────────────────────────────────────────
let time = 0;
const tmpV = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);
  time += 0.008;

  // Accretion disk particles — Kepler orbit
  diskParticles.forEach(({ geo, angles, radii, speeds, count }) => {
    const pos = geo.attributes.position;
    for (let i = 0; i < count; i++) {
      angles[i] += speeds[i];
      pos.setXYZ(i,
        Math.cos(angles[i]) * radii[i],
        pos.getY(i),
        Math.sin(angles[i]) * radii[i]
      );
    }
    pos.needsUpdate = true;
  });

  // Planet orbits — flat XZ plane + yOffset for depth
  planetMeshes.forEach((mesh, i) => {
    const p = PLANETS[i];
    const angle = time * p.orbitSpeed + p.phase;
    mesh.position.set(
      Math.cos(angle) * p.orbitR,
      p.yOffset + Math.sin(time * 0.3 + i) * 0.3,
      Math.sin(angle) * p.orbitR
    );
    mesh.rotation.y = time * 0.35;

    // Project to screen for label
    tmpV.copy(mesh.position).project(camera);
    const sx = (tmpV.x * 0.5 + 0.5) * window.innerWidth;
    const sy = -(tmpV.y * 0.5 - 0.5) * window.innerHeight;
    labels[i].style.left = sx + 'px';
    labels[i].style.top = (sy - p.radius * 60 - 8) + 'px';
    labels[i].style.display = tmpV.z < 1 ? 'block' : 'none';
  });

  // Black hole glow pulse
  glow1.material.opacity = 0.13 + Math.sin(time * 1.2) * 0.04;
  glow2.material.opacity = 0.05 + Math.sin(time * 0.8) * 0.02;

  // Slow camera drift around the scene
  const camA = time * 0.035;
  camera.position.x = Math.sin(camA) * 4;
  camera.position.z = 20 + Math.cos(camA) * 3;
  camera.position.y = 16 + Math.sin(time * 0.05) * 1.5;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}

animate();

// ── Resize ────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
