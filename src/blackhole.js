import * as THREE from 'three';

// ── Renderer ──────────────────────────────────────────────
const canvas = document.getElementById('bh-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000005);

// ── Scene & Camera ────────────────────────────────────────
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 0, 14);

// ── Stars ─────────────────────────────────────────────────
const sGeo = new THREE.BufferGeometry();
const sPts = new Float32Array(5000 * 3);
for (let i = 0; i < 5000 * 3; i++) sPts[i] = (Math.random() - 0.5) * 300;
sGeo.setAttribute('position', new THREE.BufferAttribute(sPts, 3));
scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.7 })));

// ── Black Hole ────────────────────────────────────────────
// Core (dark sphere)
const bhCore = new THREE.Mesh(
  new THREE.SphereGeometry(1.8, 64, 64),
  new THREE.MeshBasicMaterial({ color: 0x000000 })
);
scene.add(bhCore);

// Glow ring (accretion disk)
const diskGeo = new THREE.TorusGeometry(2.8, 0.6, 4, 128);
const diskMat = new THREE.MeshBasicMaterial({
  color: 0xff6600,
  wireframe: false,
  transparent: true,
  opacity: 0.55,
});
const disk = new THREE.Mesh(diskGeo, diskMat);
disk.rotation.x = Math.PI / 2.4;
scene.add(disk);

// Outer glow ring
const outerDisk = new THREE.Mesh(
  new THREE.TorusGeometry(3.4, 0.25, 4, 128),
  new THREE.MeshBasicMaterial({ color: 0xff3300, transparent: true, opacity: 0.25 })
);
outerDisk.rotation.x = Math.PI / 2.4;
scene.add(outerDisk);

// Particle swirl around black hole
const swirlGeo = new THREE.BufferGeometry();
const swirlCount = 1200;
const swirlPos = new Float32Array(swirlCount * 3);
const swirlAngles = new Float32Array(swirlCount);
const swirlRadii = new Float32Array(swirlCount);
for (let i = 0; i < swirlCount; i++) {
  swirlAngles[i] = Math.random() * Math.PI * 2;
  swirlRadii[i] = 2.2 + Math.random() * 4;
  swirlPos[i * 3] = Math.cos(swirlAngles[i]) * swirlRadii[i];
  swirlPos[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
  swirlPos[i * 3 + 2] = Math.sin(swirlAngles[i]) * swirlRadii[i];
}
swirlGeo.setAttribute('position', new THREE.BufferAttribute(swirlPos, 3));
const swirlPoints = new THREE.Points(swirlGeo, new THREE.PointsMaterial({
  color: 0xff8800, size: 0.06, transparent: true, opacity: 0.7
}));
scene.add(swirlPoints);

// ── Planets ───────────────────────────────────────────────
const PLANETS = [
  {
    name: 'PROJECTS',
    color: 0x4488ff,
    radius: 0.55,
    orbitR: 5.5,
    orbitSpeed: 0.25,
    tilt: 0.3,
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
    color: 0x00ff88,
    radius: 0.45,
    orbitR: 7.2,
    orbitSpeed: 0.18,
    tilt: -0.2,
    phase: 1.2,
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
    radius: 0.5,
    orbitR: 9.0,
    orbitSpeed: 0.12,
    tilt: 0.5,
    phase: 2.5,
    info: {
      title: '[FILE_01 — IDENTITY]',
      html: `<p>Full-stack developer specializing in web and mobile. Fluent in Laravel, Flutter, Node.js, and WordPress. Designs his own work. Freelances in cultural events when the stars align.</p>
      <br><p style="opacity:.6;font-size:.75rem">Designation: Ghazi Ben Hadj Yahia<br>Origin: Tunisia, North Africa<br>Classification: CLASS-7 COGNITIVE ENTITY</p>`
    }
  },
  {
    name: 'CONTACT',
    color: 0xff4488,
    radius: 0.38,
    orbitR: 6.0,
    orbitSpeed: 0.32,
    tilt: -0.4,
    phase: 4.0,
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
    color: 0xaa00ff,
    radius: 0.3,
    orbitR: 8.0,
    orbitSpeed: 0.42,
    tilt: 0.8,
    phase: 5.8,
    info: {
      title: '⚠ SIGNAL ENCRYPTED ⚠',
      html: `<p>You weren't supposed to find this.</p>
      <br><p style="font-family:monospace;color:#00ff88;font-size:.8rem">
      ENTITY: GBH-Ω-7749-ARCHITECT<br>
      THREAT LEVEL: ■■■■■ CREATIVE<br>
      KNOWN ABILITIES: Full-stack engineering, design, cultural infiltration<br>
      STATUS: <span style="animation:blink 1s infinite;display:inline-block">● ACTIVE</span>
      </p>
      <br><p style="opacity:.4;font-size:.65rem">DOCUMENT #XF-2749 · EYES ONLY</p>`
    }
  }
];

// Create planet meshes
const planetMeshes = [];
PLANETS.forEach((p) => {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(p.radius, 32, 32),
    new THREE.MeshStandardMaterial({ color: p.color, metalness: 0.3, roughness: 0.6 })
  );
  mesh.userData = p;
  scene.add(mesh);
  planetMeshes.push(mesh);

  // Point light on each planet
  const pl = new THREE.PointLight(p.color, 0.4, 5);
  mesh.add(pl);
});

// Ambient + directional
scene.add(new THREE.AmbientLight(0x112233, 1.2));
const sun = new THREE.DirectionalLight(0xff8800, 0.8);
sun.position.set(10, 5, 10);
scene.add(sun);

// ── HTML Labels ───────────────────────────────────────────
const labels = PLANETS.map((p, i) => {
  const el = document.createElement('div');
  el.className = 'planet-label';
  el.textContent = p.name;
  document.body.appendChild(el);
  return el;
});

// ── Raycaster ─────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(planetMeshes);
  document.body.style.cursor = hits.length > 0 ? 'pointer' : '';
});

window.addEventListener('click', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(planetMeshes);
  if (hits.length > 0) showPlanetModal(hits[0].object.userData);
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
const tmp = new THREE.Vector3();

function animate() {
  requestAnimationFrame(animate);
  time += 0.008;

  // Orbit planets
  planetMeshes.forEach((mesh, i) => {
    const p = PLANETS[i];
    const angle = time * p.orbitSpeed + p.phase;
    mesh.position.set(
      Math.cos(angle) * p.orbitR,
      Math.sin(angle * 0.5 + p.tilt) * 1.2,
      Math.sin(angle) * p.orbitR
    );
    mesh.rotation.y = time * 0.5;

    // Update HTML label position
    tmp.copy(mesh.position);
    tmp.project(camera);
    const x = (tmp.x * 0.5 + 0.5) * window.innerWidth;
    const y = -(tmp.y * 0.5 - 0.5) * window.innerHeight;
    labels[i].style.left = x + 'px';
    labels[i].style.top = (y - p.radius * 60) + 'px';
  });

  // Spin accretion disks
  disk.rotation.z = time * 0.3;
  outerDisk.rotation.z = -time * 0.2;

  // Swirl particles
  const pos = swirlGeo.attributes.position;
  for (let i = 0; i < swirlCount; i++) {
    swirlAngles[i] += 0.003 / (swirlRadii[i] * 0.3);
    pos.setXYZ(i,
      Math.cos(swirlAngles[i]) * swirlRadii[i],
      (Math.sin(time + i) * 0.3),
      Math.sin(swirlAngles[i]) * swirlRadii[i]
    );
  }
  pos.needsUpdate = true;

  // Slow camera drift
  camera.position.x = Math.sin(time * 0.07) * 2;
  camera.position.y = Math.cos(time * 0.05) * 1;
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
