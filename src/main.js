import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { XFilesTheme } from './audio.js';

gsap.registerPlugin(ScrollTrigger);

// ── Audio ─────────────────────────────────────────────────
const theme = new XFilesTheme();
const muteBtn = document.getElementById('mute-btn');
muteBtn.addEventListener('click', () => {
  const muted = theme.toggle();
  muteBtn.textContent = muted ? '🔇' : '🔊';
  muteBtn.title = muted ? 'Unmute' : 'Mute';
});
// Auto-start on first user interaction
let audioStarted = false;
const startAudio = () => {
  if (!audioStarted) { audioStarted = true; theme.init(); }
};
window.addEventListener('scroll', startAudio, { once: true });
window.addEventListener('click', startAudio, { once: true });

// ── Renderer ──────────────────────────────────────────────
const canvas = document.getElementById('bg');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// ── Scene & Camera ────────────────────────────────────────
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 0, 8);

// ── Stars ─────────────────────────────────────────────────
const starGeo = new THREE.BufferGeometry();
const starCount = 4000;
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) starPos[i] = (Math.random() - 0.5) * 200;
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.07, transparent: true, opacity: 0.8 }));
scene.add(stars);

// ── UFO ───────────────────────────────────────────────────
const ufoMeshes = [];

function buildUFO() {
  const group = new THREE.Group();
  const addMesh = (geo, mat, pos = [0, 0, 0]) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(...pos);
    group.add(m);
    ufoMeshes.push(m);
    return m;
  };

  addMesh(new THREE.CylinderGeometry(2, 1.6, 0.35, 48),
    new THREE.MeshStandardMaterial({ color: 0x778899, metalness: 0.85, roughness: 0.15 }));

  addMesh(new THREE.SphereGeometry(1.0, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x88ffcc, transparent: true, opacity: 0.55, side: THREE.DoubleSide }),
    [0, 0.18, 0]);

  addMesh(new THREE.SphereGeometry(1.5, 32, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 3),
    new THREE.MeshStandardMaterial({ color: 0x556677, metalness: 0.9, roughness: 0.2 }),
    [0, -0.1, 0]);

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const orb = addMesh(new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x00ff88 }),
      [Math.cos(angle) * 1.8, -0.1, Math.sin(angle) * 1.8]);
    const l = new THREE.PointLight(0x00ff88, 0.3, 2);
    l.position.copy(orb.position);
    group.add(l);
  }
  return group;
}

const ufo = buildUFO();
ufo.position.set(1.5, 14, -2);
ufo.scale.setScalar(0.5);
scene.add(ufo);

// ── Lights ────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0x112233, 0.8));
const beam = new THREE.SpotLight(0x00ff88, 0, 60, Math.PI / 7, 0.6, 0.8);
scene.add(beam);
const beamTarget = new THREE.Object3D();
scene.add(beamTarget);
beam.target = beamTarget;

// ── Raycaster (UFO click / hover) ─────────────────────────
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(ufoMeshes, true);
  document.body.style.cursor = hits.length > 0 ? 'pointer' : '';
});

window.addEventListener('click', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(ufoMeshes, true);
  if (hits.length > 0) showAlienModal();
});

// ── Alien ID Modal ────────────────────────────────────────
function showAlienModal() {
  const modal = document.getElementById('alien-modal');
  if (modal) {
    modal.classList.add('visible');
    glitchText(document.getElementById('alien-id'), 'GBH-Ω-7749-ARCHITECT');
  }
}

function glitchText(el, finalText) {
  if (!el) return;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
  let iter = 0;
  const interval = setInterval(() => {
    el.textContent = finalText.split('').map((c, i) =>
      i < iter ? finalText[i] : chars[Math.floor(Math.random() * chars.length)]
    ).join('');
    if (iter >= finalText.length) clearInterval(interval);
    iter += 0.5;
  }, 40);
}

window.closeAlienModal = () => document.getElementById('alien-modal')?.classList.remove('visible');
document.addEventListener('click', (e) => { if (e.target.id === 'alien-modal') window.closeAlienModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') window.closeAlienModal(); });

// ── Black Hole Trigger (scroll bottom) ───────────────────
let blackHoleTriggered = false;

window.addEventListener('scroll', () => {
  if (blackHoleTriggered) return;
  const distFromBottom = document.body.scrollHeight - window.scrollY - window.innerHeight;
  if (distFromBottom < 50) {
    blackHoleTriggered = true;
    triggerBlackHole();
  }
});

function triggerBlackHole() {
  const overlay = document.getElementById('blackhole-overlay');
  if (!overlay) return;

  overlay.classList.add('active');

  // Suck in the content
  gsap.to('#content', {
    scale: 0.1,
    rotation: 720,
    opacity: 0,
    duration: 1.8,
    ease: 'power4.in',
  });

  gsap.to('canvas#bg', {
    scale: 0.1,
    opacity: 0,
    duration: 1.8,
    ease: 'power4.in',
  });

  // Navigate after animation
  setTimeout(() => {
    window.location.href = 'blackhole.html';
  }, 2000);
}

// ── Scroll state ──────────────────────────────────────────
let scrollY = 0;
window.addEventListener('scroll', () => { scrollY = window.scrollY; });

// ── Section reveals ───────────────────────────────────────
document.querySelectorAll('.reveal-section').forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 78%',
    onEnter: () => el.classList.add('revealed'),
  });
});

// ── Animation loop ────────────────────────────────────────
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.012;

  const maxScroll = document.body.scrollHeight - window.innerHeight || 1;
  const t = scrollY / maxScroll;

  ufo.position.y += (12 - t * 26 - ufo.position.y) * 0.06;
  ufo.position.x += (Math.sin(t * Math.PI * 1.5) * 3 - ufo.position.x) * 0.06;
  ufo.position.y += Math.sin(time * 1.8) * 0.015;
  ufo.rotation.y = time * 0.4;

  beam.position.copy(ufo.position);
  beamTarget.position.set(ufo.position.x, ufo.position.y - 20, ufo.position.z);
  beam.intensity = t > 0.02 ? 2.5 + Math.sin(time * 3) * 0.3 : 0;

  stars.rotation.y = time * 0.015;
  stars.rotation.x = time * 0.007;

  renderer.render(scene, camera);
}

animate();

// ── Resize ────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
