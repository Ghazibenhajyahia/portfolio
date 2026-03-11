import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── Renderer ──────────────────────────────────────────────
const canvas = document.getElementById('bg');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ── Scene & Camera ────────────────────────────────────────
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 0, 8);

// ── Stars ─────────────────────────────────────────────────
const starGeo = new THREE.BufferGeometry();
const starCount = 4000;
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
  starPos[i] = (Math.random() - 0.5) * 200;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.07,
  transparent: true,
  opacity: 0.8,
});
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// ── UFO ───────────────────────────────────────────────────
function buildUFO() {
  const group = new THREE.Group();

  // Saucer disc
  const discGeo = new THREE.CylinderGeometry(2, 1.6, 0.35, 48);
  const discMat = new THREE.MeshStandardMaterial({
    color: 0x778899,
    metalness: 0.85,
    roughness: 0.15,
  });
  const disc = new THREE.Mesh(discGeo, discMat);
  group.add(disc);

  // Upper dome
  const domeGeo = new THREE.SphereGeometry(1.0, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMat = new THREE.MeshStandardMaterial({
    color: 0x88ffcc,
    metalness: 0.1,
    roughness: 0.0,
    transparent: true,
    opacity: 0.55,
    side: THREE.DoubleSide,
  });
  const dome = new THREE.Mesh(domeGeo, domeMat);
  dome.position.y = 0.18;
  group.add(dome);

  // Bottom hull
  const hullGeo = new THREE.SphereGeometry(1.5, 32, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 3);
  const hullMat = new THREE.MeshStandardMaterial({
    color: 0x556677,
    metalness: 0.9,
    roughness: 0.2,
  });
  const hull = new THREE.Mesh(hullGeo, hullMat);
  hull.position.y = -0.1;
  group.add(hull);

  // Ring lights (8 green orbs)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x00ff88 })
    );
    orb.position.set(Math.cos(angle) * 1.8, -0.1, Math.sin(angle) * 1.8);
    group.add(orb);

    // Glow point light per orb (subtle)
    const orbLight = new THREE.PointLight(0x00ff88, 0.3, 2);
    orbLight.position.copy(orb.position);
    group.add(orbLight);
  }

  return group;
}

const ufo = buildUFO();
ufo.position.set(1.5, 14, -2);
ufo.scale.setScalar(0.5);
scene.add(ufo);

// ── Lights ────────────────────────────────────────────────
const ambient = new THREE.AmbientLight(0x112233, 0.8);
scene.add(ambient);

// UFO spotlight beam (green, pointing down)
const beam = new THREE.SpotLight(0x00ff88, 0, 60, Math.PI / 7, 0.6, 0.8);
beam.castShadow = false;
scene.add(beam);
const beamTarget = new THREE.Object3D();
scene.add(beamTarget);
beam.target = beamTarget;

// ── Scroll state ──────────────────────────────────────────
let scrollY = 0;
window.addEventListener('scroll', () => { scrollY = window.scrollY; });

// ── Section reveals via ScrollTrigger ─────────────────────
document.querySelectorAll('.reveal-section').forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    start: 'top 78%',
    onEnter: () => {
      el.classList.add('revealed');
    },
  });
});

// ── Animation loop ────────────────────────────────────────
let time = 0;

function animate() {
  requestAnimationFrame(animate);
  time += 0.012;

  const maxScroll = document.body.scrollHeight - window.innerHeight || 1;
  const t = scrollY / maxScroll; // 0 → 1

  // UFO descends from top as user scrolls
  const targetY = 12 - t * 26;
  const targetX = Math.sin(t * Math.PI * 1.5) * 3;
  ufo.position.y += (targetY - ufo.position.y) * 0.06;
  ufo.position.x += (targetX - ufo.position.x) * 0.06;
  ufo.position.y += Math.sin(time * 1.8) * 0.015; // hover wobble
  ufo.rotation.y = time * 0.4;

  // Beam follows UFO, brightens after first scroll
  beam.position.copy(ufo.position);
  beamTarget.position.set(ufo.position.x, ufo.position.y - 20, ufo.position.z);
  beam.intensity = t > 0.02 ? 2.5 + Math.sin(time * 3) * 0.3 : 0;

  // Slowly rotate star field
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
