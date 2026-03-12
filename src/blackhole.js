import * as THREE from 'three';

// ── Renderer ──────────────────────────────────────────────
const canvas = document.getElementById('bh-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000005);

// ── Scene & Camera ────────────────────────────────────────
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000005, 0.012);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 600);
// View from slightly above the orbital plane for depth
camera.position.set(0, 8, 22);
camera.lookAt(0, 0, 0);

// ── Stars (background sphere) ─────────────────────────────
const sGeo = new THREE.BufferGeometry();
const sPts = new Float32Array(6000 * 3);
for (let i = 0; i < 6000 * 3; i++) sPts[i] = (Math.random() - 0.5) * 400;
sGeo.setAttribute('position', new THREE.BufferAttribute(sPts, 3));
scene.add(new THREE.Points(sGeo,
  new THREE.PointsMaterial({ color: 0xffffff, size: 0.055, transparent: true, opacity: 0.75 })
));

// ── Orbital plane quaternion ───────────────────────────────
// Accretion disk tilt — all orbits share this plane
const DISK_TILT = Math.PI / 2.6;
const orbitNormal = new THREE.Vector3(0, 1, 0)
  .applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(DISK_TILT, 0, 0)));
const orbitQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(DISK_TILT, 0, 0));

// Helper: orbit position in disk plane
function orbitPosition(angle, radius) {
  const local = new THREE.Vector3(
    Math.cos(angle) * radius,
    0,
    Math.sin(angle) * radius
  );
  local.applyQuaternion(orbitQuaternion);
  return local;
}

// ── Black Hole Core ───────────────────────────────────────
// Inner dark sphere
const bhCore = new THREE.Mesh(
  new THREE.SphereGeometry(2.0, 64, 64),
  new THREE.MeshBasicMaterial({ color: 0x000000 })
);
scene.add(bhCore);

// Photon sphere glow (slightly larger, emissive orange edge)
const photonSphere = new THREE.Mesh(
  new THREE.SphereGeometry(2.35, 64, 64),
  new THREE.MeshBasicMaterial({ color: 0xff5500, transparent: true, opacity: 0.12, side: THREE.BackSide })
);
scene.add(photonSphere);

// ── Accretion Disk ────────────────────────────────────────
const diskGroup = new THREE.Group();
diskGroup.rotation.x = DISK_TILT;
scene.add(diskGroup);

// Main disk — thick inner ring
const diskInner = new THREE.Mesh(
  new THREE.TorusGeometry(3.0, 0.8, 6, 160),
  new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.75 })
);
diskGroup.add(diskInner);

// Mid ring
const diskMid = new THREE.Mesh(
  new THREE.TorusGeometry(4.2, 0.45, 4, 160),
  new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.45 })
);
diskGroup.add(diskMid);

// Outer ring
const diskOuter = new THREE.Mesh(
  new THREE.TorusGeometry(5.4, 0.2, 4, 160),
  new THREE.MeshBasicMaterial({ color: 0xff2200, transparent: true, opacity: 0.25 })
);
diskGroup.add(diskOuter);

// ── Accretion Particles (in orbital plane) ────────────────
const partCount = 2000;
const partGeo = new THREE.BufferGeometry();
const partPos = new Float32Array(partCount * 3);
const partAngles = new Float32Array(partCount);
const partRadii = new Float32Array(partCount);
const partSpeeds = new Float32Array(partCount);

for (let i = 0; i < partCount; i++) {
  partAngles[i] = Math.random() * Math.PI * 2;
  partRadii[i] = 2.4 + Math.random() * 4.5; // 2.4 → 6.9
  // Kepler speed: ω ∝ 1/r^1.5
  partSpeeds[i] = 0.012 / Math.pow(partRadii[i] * 0.25, 1.5);
  const p = orbitPosition(partAngles[i], partRadii[i]);
  partPos[i * 3] = p.x;
  partPos[i * 3 + 1] = p.y + (Math.random() - 0.5) * 0.3;
  partPos[i * 3 + 2] = p.z;
}
partGeo.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
const partMesh = new THREE.Points(partGeo, new THREE.PointsMaterial({
  color: 0xff8800, size: 0.055, transparent: true, opacity: 0.85
}));
scene.add(partMesh);

// ── Planets ───────────────────────────────────────────────
// Kepler: angular speed ∝ 1 / sqrt(r)  (normalized so inner ~0.30 rad/s)
const BASE_SPEED = 1.0;
function keplerSpeed(r) { return BASE_SPEED / Math.sqrt(r); }

const PLANETS = [
  {
    name: 'PROJECTS',
    color: 0x2266ff,
    emissive: 0x001133,
    radius: 0.70,   // large — most work
    orbitR: 7.5,
    phase: 0,
    info: {
      title: '[FILE_02 — OPERATIONS]',
      html: `<ul>
        <li><a href="https://lagora.tn" target="_blank">lagora.tn</a> — WordPress marketplace</li>
        <li><a href="https://thelandlord.tn" target="_blank">thelandlord.tn</a> — Flutter + Node.js mobile app</li>
        <li><a href="https://manager.thelandlord.tn" target="_blank">manager.thelandlord.tn</a> — PMS (Laravel)</li>
        <li>Secadenordigital SCADA — Industrial ERP (Laravel)</li>
        <li><a href="https://envirofest.tn" target="_blank">envirofest.tn</a> — Festival platform (WordPress)</li>
        <li><a href="https://conciergetunisie.thelandlord.tn" target="_blank">conciergetunisie</a> — Concierge service (WordPress)</li>
      </ul>`
    }
  },
  {
    name: 'SKILLS',
    color: 0x00cc66,
    emissive: 0x003311,
    radius: 0.55,
    orbitR: 9.5,
    phase: (Math.PI * 2) / 5,
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
    radius: 0.60,
    orbitR: 11.5,
    phase: (Math.PI * 2 * 2) / 5,
    info: {
      title: '[FILE_01 — IDENTITY]',
      html: `<p>Full-stack developer specializing in web and mobile. Fluent in Laravel, Flutter, Node.js, and WordPress. Designs his own work. Freelances in cultural events when the stars align.</p>
      <br><p style="opacity:.6;font-size:.75rem">Designation: Ghazi Ben Hadj Yahia<br>Origin: Tunisia, North Africa<br>Classification: CLASS-7 COGNITIVE ENTITY</p>`
    }
  },
  {
    name: 'CONTACT',
    color: 0xff3366,
    emissive: 0x220011,
    radius: 0.42,
    orbitR: 6.0,
    phase: (Math.PI * 2 * 3) / 5,
    info: {
      title: '[FILE_04 — ESTABLISH CONTACT]',
      html: `<ul>
        <li><a href="mailto:gbhy1919@gmail.com">gbhy1919@gmail.com</a></li>
        <li><a href="https://github.com/Ghazibenhajyahia" target="_blank">github.com/Ghazibenhajyahia</a></li>
      </ul>
      <br><p style="opacity:.5;font-size:.72rem">Available for freelance, collabs, and interesting problems.</p>`
    }
  },
  {
    name: '???',
    color: 0x9900ff,
    emissive: 0x110033,
    radius: 0.32,
    orbitR: 13.5,
    phase: (Math.PI * 2 * 4) / 5,
    info: {
      title: '⚠ SIGNAL ENCRYPTED ⚠',
      html: `<p>You weren't supposed to find this.</p>
      <br><p style="font-family:monospace;color:#00ff88;font-size:.8rem">
      ENTITY: GBH-Ω-7749-ARCHITECT<br>
      THREAT LEVEL: ■■■■■ CREATIVE<br>
      KNOWN ABILITIES: Full-stack engineering · Design · Cultural infiltration<br>
      STATUS: ● ACTIVE — MONITORING
      </p>
      <br><p style="opacity:.4;font-size:.65rem">DOCUMENT #XF-2749 · EYES ONLY</p>`
    }
  }
];

// Compute Kepler speeds
PLANETS.forEach(p => {
  p.orbitSpeed = keplerSpeed(p.orbitR) * 0.28;
});

const planetMeshes = [];
PLANETS.forEach((p) => {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(p.radius, 48, 48),
    new THREE.MeshStandardMaterial({
      color: p.color,
      emissive: p.emissive,
      metalness: 0.2,
      roughness: 0.65,
    })
  );
  mesh.userData = p;
  scene.add(mesh);
  planetMeshes.push(mesh);

  // Atmospheric glow around each planet
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(p.radius * 1.35, 32, 32),
    new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: 0.07, side: THREE.BackSide })
  );
  mesh.add(glow);

  // Point light
  mesh.add(new THREE.PointLight(p.color, 0.6, 6));
});

// ── HTML Labels ───────────────────────────────────────────
const labels = PLANETS.map((p) => {
  const el = document.createElement('div');
  el.className = 'planet-label';
  el.textContent = p.name;
  document.body.appendChild(el);
  return el;
});

// ── Orbit trail rings (subtle, in disk plane) ─────────────
PLANETS.forEach((p) => {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(p.orbitR, 0.012, 3, 180),
    new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.06 })
  );
  ring.applyQuaternion(orbitQuaternion);
  scene.add(ring);
});

// ── Lights ────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x111133, 1.5));
const bhLight = new THREE.PointLight(0xff6600, 1.5, 30);
bhLight.position.set(0, 0, 0);
scene.add(bhLight);

// ── Raycaster ─────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
raycaster.params.Points = { threshold: 0.2 };
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(planetMeshes, true);
  document.body.style.cursor = hits.length > 0 ? 'pointer' : '';
});

window.addEventListener('click', (e) => {
  if (e.target.id === 'planet-modal' || e.target.closest('.planet-card')) return;
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(planetMeshes, true);
  if (hits.length > 0) {
    const mesh = hits[0].object.userData.name ? hits[0].object : hits[0].object.parent;
    if (mesh.userData.info) showPlanetModal(mesh.userData);
  }
});

// ── Modal ─────────────────────────────────────────────────
function showPlanetModal(data) {
  document.getElementById('planet-modal-title').textContent = data.info.title;
  document.getElementById('planet-modal-body').innerHTML = data.info.html;
  document.getElementById('planet-modal').classList.add('visible');
}
window.closePlanetModal = () => document.getElementById('planet-modal').classList.remove('visible');
document.addEventListener('click', (e) => { if (e.target.id === 'planet-modal') window.closePlanetModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') window.closePlanetModal(); });

// ── Animation ─────────────────────────────────────────────
let time = 0;
const tmpV = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);
  time += 0.008;

  // Orbit particles — Kepler speeds
  const pPos = partGeo.attributes.position;
  for (let i = 0; i < partCount; i++) {
    partAngles[i] += partSpeeds[i];
    const p = orbitPosition(partAngles[i], partRadii[i]);
    pPos.setXYZ(i, p.x, p.y + Math.sin(time * 2 + i) * 0.08, p.z);
  }
  pPos.needsUpdate = true;

  // Orbit planets — all in same quaternion plane, Kepler speeds
  planetMeshes.forEach((mesh, i) => {
    const pd = PLANETS[i];
    const angle = time * pd.orbitSpeed + pd.phase;
    const pos = orbitPosition(angle, pd.orbitR);
    mesh.position.copy(pos);
    mesh.rotation.y = time * 0.4;

    // Update label
    tmpV.copy(mesh.position);
    tmpV.project(camera);
    const sx = (tmpV.x * 0.5 + 0.5) * window.innerWidth;
    const sy = -(tmpV.y * 0.5 - 0.5) * window.innerHeight;
    labels[i].style.left = sx + 'px';
    labels[i].style.top = (sy - pd.radius * 55 - 12) + 'px';
    labels[i].style.opacity = tmpV.z < 1 ? '0.85' : '0'; // hide if behind
  });

  // Spin disk rings
  diskInner.rotation.z = time * 0.35;
  diskMid.rotation.z = -time * 0.22;
  diskOuter.rotation.z = time * 0.15;

  // Black hole photon sphere pulse
  photonSphere.material.opacity = 0.10 + Math.sin(time * 1.5) * 0.04;

  // Gentle camera orbit
  const camAngle = time * 0.04;
  camera.position.x = Math.sin(camAngle) * 3;
  camera.position.z = 22 + Math.cos(camAngle) * 2;
  camera.position.y = 8 + Math.sin(time * 0.06) * 1.5;
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
