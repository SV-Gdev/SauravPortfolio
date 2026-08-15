'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

// ----------------------------------------------------
// Web Audio API Procedural Sound Synthesizer
// ----------------------------------------------------
class SoundFX {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // AudioContext created on user gesture
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {}
  }

  public playSwitch() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {}
  }

  public playBurst() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      // Low frequency boom + noise pitch drop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(250, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch {}
  }
}

const sfx = new SoundFX();

// ----------------------------------------------------
// Color Palettes
// ----------------------------------------------------
const PALETTES = [
  { id: 'cyan', name: 'Cyber Cyan', primary: 0x00d4ff, secondary: 0x8b5cf6, bgGlow: 'rgba(0,212,255,0.25)' },
  { id: 'magenta', name: 'Neon Magenta', primary: 0xff007f, secondary: 0x7928ca, bgGlow: 'rgba(255,0,127,0.25)' },
  { id: 'emerald', name: 'Matrix Green', primary: 0x10b981, secondary: 0x06b6d4, bgGlow: 'rgba(16,185,129,0.25)' },
  { id: 'gold', name: 'Solar Gold', primary: 0xf59e0b, secondary: 0xef4444, bgGlow: 'rgba(245,158,11,0.25)' },
  { id: 'violet', name: 'Deep Violet', primary: 0xa855f7, secondary: 0xec4899, bgGlow: 'rgba(168,85,247,0.25)' },
];

export default function Hero3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  // States
  const [modelType, setModelType] = useState<number>(0); // 0: Cyber Core, 1: Gamepad, 2: Energy Shield, 3: Sci-Fi Drone, 4: Matrix
  const [paletteIndex, setPaletteIndex] = useState<number>(0);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(8);
  const [roughness, setRoughness] = useState<number>(0.15);
  const [metalness, setMetalness] = useState<number>(0.9);
  const [fps, setFps] = useState<number>(60);
  const [polyCount, setPolyCount] = useState<number>(0);
  const [burstCount, setBurstCount] = useState<number>(0);
  const [rotDegrees, setRotDegrees] = useState({ x: 0, y: 0, z: 0 });

  // Refs for WebGL animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const particleGroupRef = useRef<THREE.Points | null>(null);
  const burstParticlesRef = useRef<{ positions: Float32Array; velocities: Float32Array; mesh: THREE.Points } | null>(null);
  const lightsRef = useRef<{ point1: THREE.PointLight; point2: THREE.PointLight } | null>(null);
  const activeMaterialsRef = useRef<THREE.Material[]>([]);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const wireframeRef = useRef(wireframe);
  const autoRotateRef = useRef(autoRotate);
  const roughnessRef = useRef(roughness);
  const metalnessRef = useRef(metalness);
  const paletteRef = useRef(PALETTES[0]);

  useEffect(() => { wireframeRef.current = wireframe; }, [wireframe]);
  useEffect(() => { autoRotateRef.current = autoRotate; }, [autoRotate]);
  useEffect(() => { roughnessRef.current = roughness; }, [roughness]);
  useEffect(() => { metalnessRef.current = metalness; }, [metalness]);
  useEffect(() => { paletteRef.current = PALETTES[paletteIndex]; }, [paletteIndex]);

  // Audio Toggle
  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    sfx.setEnabled(next);
    if (next) sfx.playClick();
  };

  // ----------------------------------------------------
  // Procedural 3D Model Builders
  // ----------------------------------------------------
  const buildModel = useCallback((type: number, palette: typeof PALETTES[0], isWire: boolean, rough: number, metal: number) => {
    const group = new THREE.Group();
    activeMaterialsRef.current = [];

    const mainMat = new THREE.MeshStandardMaterial({
      color: 0x0a0c16,
      roughness: rough,
      metalness: metal,
      emissive: palette.primary,
      emissiveIntensity: 0.3,
      wireframe: isWire,
    });
    activeMaterialsRef.current.push(mainMat);

    const wireMat = new THREE.MeshBasicMaterial({
      color: palette.primary,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    activeMaterialsRef.current.push(wireMat);

    const accentMat = new THREE.MeshBasicMaterial({
      color: palette.secondary,
      wireframe: isWire,
      transparent: true,
      opacity: 0.85,
    });
    activeMaterialsRef.current.push(accentMat);

    let totalTriangles = 0;

    if (type === 0) {
      // 0: Cyber Core
      const coreGeo = new THREE.IcosahedronGeometry(2.0, 1);
      const coreMesh = new THREE.Mesh(coreGeo, mainMat);
      group.add(coreMesh);

      const outerGeo = new THREE.IcosahedronGeometry(2.5, 1);
      const outerMesh = new THREE.Mesh(outerGeo, wireMat);
      group.add(outerMesh);

      const innerGeo = new THREE.OctahedronGeometry(1.2, 0);
      const innerMesh = new THREE.Mesh(innerGeo, accentMat);
      innerMesh.name = 'innerMesh';
      group.add(innerMesh);

      totalTriangles = coreGeo.index ? coreGeo.index.count / 3 : coreGeo.attributes.position.count / 3;
    } else if (type === 1) {
      // 1: Gamepad / Game Engine Controller
      const bodyGeo = new THREE.BoxGeometry(3.6, 1.8, 0.9);
      const bodyMesh = new THREE.Mesh(bodyGeo, mainMat);
      group.add(bodyMesh);

      // Handle Left
      const handleLGeo = new THREE.CylinderGeometry(0.5, 0.4, 1.8, 16);
      const handleL = new THREE.Mesh(handleLGeo, mainMat);
      handleL.rotation.z = -0.3;
      handleL.position.set(-1.8, -0.6, 0);
      group.add(handleL);

      // Handle Right
      const handleR = new THREE.Mesh(handleLGeo, mainMat);
      handleR.rotation.z = 0.3;
      handleR.position.set(1.8, -0.6, 0);
      group.add(handleR);

      // D-Pad Left
      const dpadGeo = new THREE.BoxGeometry(0.7, 0.7, 0.2);
      const dpad = new THREE.Mesh(dpadGeo, accentMat);
      dpad.position.set(-1.1, 0.1, 0.5);
      group.add(dpad);

      // Action Buttons Right (4 Orbs)
      const btnGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const btnPositions = [
        [1.1, 0.4, 0.5],
        [1.4, 0.1, 0.5],
        [1.1, -0.2, 0.5],
        [0.8, 0.1, 0.5],
      ];
      btnPositions.forEach(([bx, by, bz]) => {
        const btn = new THREE.Mesh(btnGeo, accentMat);
        btn.position.set(bx, by, bz);
        group.add(btn);
      });

      // Thumbsticks
      const stickGeo = new THREE.CylinderGeometry(0.4, 0.3, 0.5, 16);
      const stickL = new THREE.Mesh(stickGeo, mainMat);
      stickL.position.set(-0.5, -0.3, 0.5);
      group.add(stickL);

      const stickR = new THREE.Mesh(stickGeo, mainMat);
      stickR.position.set(0.5, -0.3, 0.5);
      group.add(stickR);

      totalTriangles = 300;
    } else if (type === 2) {
      // 2: Energy Shield / Cyber Crest
      const torusKnotGeo = new THREE.TorusKnotGeometry(1.6, 0.4, 100, 16);
      const torusMesh = new THREE.Mesh(torusKnotGeo, mainMat);
      group.add(torusMesh);

      const ring1Geo = new THREE.TorusGeometry(2.6, 0.05, 16, 64);
      const ring1 = new THREE.Mesh(ring1Geo, wireMat);
      group.add(ring1);

      const ring2Geo = new THREE.TorusGeometry(3.0, 0.03, 16, 64);
      const ring2 = new THREE.Mesh(ring2Geo, accentMat);
      ring2.rotation.x = Math.PI / 3;
      group.add(ring2);

      totalTriangles = torusKnotGeo.index ? torusKnotGeo.index.count / 3 : 1200;
    } else if (type === 3) {
      // 3: Sci-Fi Drone Core
      const droneCenterGeo = new THREE.SphereGeometry(1.2, 24, 24);
      const droneCenter = new THREE.Mesh(droneCenterGeo, mainMat);
      group.add(droneCenter);

      // 4 Rotor Arms
      const armGeo = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 12);
      const arm1 = new THREE.Mesh(armGeo, mainMat);
      arm1.rotation.z = Math.PI / 4;
      group.add(arm1);

      const arm2 = new THREE.Mesh(armGeo, mainMat);
      arm2.rotation.z = -Math.PI / 4;
      group.add(arm2);

      // 4 Rotors
      const rotorRingGeo = new THREE.TorusGeometry(0.7, 0.06, 12, 32);
      const rotorPositions = [
        [1.3, 1.3, 0],
        [-1.3, 1.3, 0],
        [1.3, -1.3, 0],
        [-1.3, -1.3, 0],
      ];
      rotorPositions.forEach(([rx, ry, rz]) => {
        const rRing = new THREE.Mesh(rotorRingGeo, accentMat);
        rRing.position.set(rx, ry, rz);
        group.add(rRing);
      });

      totalTriangles = 800;
    } else {
      // 4: Floating Matrix of Cubes
      const cubeGeo = new THREE.BoxGeometry(0.75, 0.75, 0.75);
      let count = 0;
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            if (x === 0 && y === 0 && z === 0) continue;
            const mat = (x + y + z) % 2 === 0 ? mainMat : accentMat;
            const cube = new THREE.Mesh(cubeGeo, mat);
            cube.position.set(x * 1.3, y * 1.3, z * 1.3);
            group.add(cube);
            count++;
          }
        }
      }
      totalTriangles = count * 12;
    }

    setPolyCount(Math.round(totalTriangles));
    return group;
  }, []);

  // ----------------------------------------------------
  // Trigger Particle Burst Effect
  // ----------------------------------------------------
  const triggerBurst = useCallback(() => {
    if (!sceneRef.current) return;
    sfx.playBurst();
    setBurstCount((prev) => prev + 1);

    const currentPalette = PALETTES[paletteIndex];
    const particleCount = 200;

    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      // Random spherical velocity
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 0.15 + Math.random() * 0.25;

      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: currentPalette.primary,
      size: 0.15,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
    });

    const burstMesh = new THREE.Points(geo, mat);
    sceneRef.current.add(burstMesh);

    burstParticlesRef.current = { positions, velocities, mesh: burstMesh };
  }, [paletteIndex]);

  // ----------------------------------------------------
  // Initialize Three.js Scene
  // ----------------------------------------------------
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 480;
    const height = mount.clientHeight || 480;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, zoomLevel);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const point1 = new THREE.PointLight(PALETTES[paletteIndex].primary, 4, 25);
    point1.position.set(6, 6, 6);
    scene.add(point1);

    const point2 = new THREE.PointLight(PALETTES[paletteIndex].secondary, 4, 25);
    point2.position.set(-6, -6, -6);
    scene.add(point2);

    lightsRef.current = { point1, point2 };

    // Initial 3D Model
    const modelGroup = buildModel(modelType, PALETTES[paletteIndex], wireframe, roughness, metalness);
    mainGroupRef.current = modelGroup;
    scene.add(modelGroup);

    // Background Particle Ambient Dust
    const dustCount = 250;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 16;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: PALETTES[paletteIndex].primary,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
    });
    const dustParticles = new THREE.Points(dustGeo, dustMat);
    particleGroupRef.current = dustParticles;
    scene.add(dustParticles);

    // Mouse Interaction (Click & Drag Rotation + Click to Burst)
    let isDragging = false;
    let dragMoved = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      dragMoved = false;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
        dragMoved = true;
      }

      if (mainGroupRef.current) {
        mainGroupRef.current.rotation.y += deltaX * 0.008;
        mainGroupRef.current.rotation.x += deltaY * 0.008;
      }

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      if (isDragging && !dragMoved) {
        // Trigger particle burst on single click!
        triggerBurst();
      }
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.style.cursor = 'grab';
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize
    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 480;
      const h = mount.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // FPS Calculation
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      // Auto Rotation
      if (autoRotateRef.current && mainGroupRef.current && !isDragging) {
        mainGroupRef.current.rotation.y += delta * 0.5;
        mainGroupRef.current.rotation.x += delta * 0.25;
      }

      // Rotate sub-elements for animations
      if (mainGroupRef.current) {
        const inner = mainGroupRef.current.getObjectByName('innerMesh');
        if (inner) {
          inner.rotation.y -= delta * 1.5;
          inner.rotation.z += delta * 0.8;
        }
      }

      // Animate ambient dust
      if (particleGroupRef.current) {
        particleGroupRef.current.rotation.y = elapsedTime * 0.05;
      }

      // Animate Particle Burst if active
      if (burstParticlesRef.current) {
        const { positions, velocities, mesh } = burstParticlesRef.current;
        const posAttr = mesh.geometry.attributes.position as THREE.BufferAttribute;

        for (let i = 0; i < positions.length / 3; i++) {
          positions[i * 3] += velocities[i * 3];
          positions[i * 3 + 1] += velocities[i * 3 + 1];
          positions[i * 3 + 2] += velocities[i * 3 + 2];
        }

        posAttr.needsUpdate = true;
        (mesh.material as THREE.PointsMaterial).opacity -= delta * 1.2;

        if ((mesh.material as THREE.PointsMaterial).opacity <= 0) {
          scene.remove(mesh);
          mesh.geometry.dispose();
          (mesh.material as THREE.Material).dispose();
          burstParticlesRef.current = null;
        }
      }

      // Update HUD Degrees
      if (mainGroupRef.current) {
        setRotDegrees({
          x: Math.round((mainGroupRef.current.rotation.x * (180 / Math.PI)) % 360),
          y: Math.round((mainGroupRef.current.rotation.y * (180 / Math.PI)) % 360),
          z: Math.round((mainGroupRef.current.rotation.z * (180 / Math.PI)) % 360),
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [buildModel, triggerBurst]);

  // Update Model when type changes
  useEffect(() => {
    if (!sceneRef.current || !mainGroupRef.current) return;
    sceneRef.current.remove(mainGroupRef.current);

    const newGroup = buildModel(modelType, PALETTES[paletteIndex], wireframe, roughness, metalness);
    mainGroupRef.current = newGroup;
    sceneRef.current.add(newGroup);
    sfx.playSwitch();
  }, [modelType, buildModel, paletteIndex, wireframe, roughness, metalness]);

  // Update Lights & Materials when Palette changes
  useEffect(() => {
    const pal = PALETTES[paletteIndex];
    if (lightsRef.current) {
      lightsRef.current.point1.color.setHex(pal.primary);
      lightsRef.current.point2.color.setHex(pal.secondary);
    }
    if (particleGroupRef.current) {
      (particleGroupRef.current.material as THREE.PointsMaterial).color.setHex(pal.primary);
    }
  }, [paletteIndex]);

  // Update Camera Zoom
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = zoomLevel;
    }
  }, [zoomLevel]);

  // Model Labels
  const MODEL_NAMES = [
    '💎 Cyber Core',
    '🎮 Game Controller',
    '🛡️ Energy Shield',
    '🛸 Sci-Fi Drone',
    '🎲 Cube Matrix',
  ];

  return (
    <div className="relative w-full max-w-[560px] mx-auto flex flex-col items-center">
      {/* 3D WebGL Viewport Glassmorphic Box */}
      <div className="w-full relative aspect-square rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-[rgba(255,255,255,0.15)] bg-[rgba(10,12,22,0.75)] backdrop-blur-xl">
        {/* WebGL Canvas Container */}
        <div ref={mountRef} className="w-full h-full" />

        {/* Ambient Color Glow Backdrop */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-700"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${PALETTES[paletteIndex].bgGlow} 0%, rgba(0,0,0,0) 70%)`,
          }}
        />

        {/* Sci-Fi Brackets Corner Styling */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[var(--accent-primary)] pointer-events-none" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[var(--accent-primary)] pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[var(--accent-primary)] pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[var(--accent-primary)] pointer-events-none" />

        {/* Top HUD Telemetry Bar */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[rgba(0,0,0,0.7)] backdrop-blur-md rounded-xl border border-[var(--border-color)] text-[11px] font-mono text-white">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            <span className="font-bold text-[var(--accent-primary)]">3D STUDIO PRO</span>
            <span className="text-[var(--text-secondary)]">| {fps} FPS</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className="pointer-events-auto px-3 py-1.5 bg-[rgba(0,0,0,0.7)] hover:bg-[rgba(255,255,255,0.1)] backdrop-blur-md rounded-xl border border-[var(--border-color)] text-xs text-white transition-colors cursor-pointer"
              title="Toggle Audio Feedback"
            >
              {audioEnabled ? '🔊 Sound ON' : '🔇 Muted'}
            </button>
          </div>
        </div>

        {/* Floating Instruction Banner */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between p-3 bg-[rgba(0,0,0,0.75)] backdrop-blur-md rounded-2xl border border-[var(--border-color)] text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <span className="text-base">🖱️</span>
            <span>Drag to rotate • Single click for particle shockwave</span>
          </div>
          <span className="font-mono text-[var(--accent-primary)] font-semibold">
            {burstCount > 0 && `💥 ${burstCount} Bursts`}
          </span>
        </div>
      </div>

      {/* Interactive 3D Model Selector Tabs */}
      <div className="w-full mt-4 flex flex-wrap gap-2 justify-center">
        {MODEL_NAMES.map((name, idx) => (
          <button
            key={name}
            onClick={() => setModelType(idx)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              modelType === idx
                ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white border-transparent shadow-[0_0_15px_rgba(0,212,255,0.4)] scale-105'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-white hover:border-[var(--accent-primary)]'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Advanced Interactive Control Panel */}
      <div className="w-full mt-4 p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-[var(--shadow-card)] space-y-4">
        {/* Color Palette Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-semibold text-[var(--text-secondary)]">🎨 Neon Color Theme:</span>
          <div className="flex gap-2">
            {PALETTES.map((pal, idx) => (
              <button
                key={pal.id}
                onClick={() => {
                  setPaletteIndex(idx);
                  sfx.playClick();
                }}
                className={`w-7 h-7 rounded-full transition-transform cursor-pointer border-2 ${
                  paletteIndex === idx ? 'scale-125 border-white shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: `#${pal.primary.toString(16).padStart(6, '0')}` }}
                title={pal.name}
              />
            ))}
          </div>
        </div>

        {/* Controls Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => {
              setWireframe(!wireframe);
              sfx.playClick();
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              wireframe
                ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                : 'bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-white'
            }`}
          >
            🔮 {wireframe ? 'Solid Mesh' : 'Wireframe'}
          </button>

          <button
            onClick={() => {
              setAutoRotate(!autoRotate);
              sfx.playClick();
            }}
            className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
              autoRotate
                ? 'bg-[var(--accent-secondary)] text-white border-[var(--accent-secondary)]'
                : 'bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-white'
            }`}
          >
            🔄 {autoRotate ? 'Auto-Spin ON' : 'Paused'}
          </button>

          <button
            onClick={triggerBurst}
            className="py-2 px-3 text-xs font-bold bg-gradient-to-r from-[#ff007f] to-[#7928ca] text-white rounded-xl shadow-[0_0_15px_rgba(255,0,127,0.4)] hover:scale-105 transition-all cursor-pointer"
          >
            💥 Shockwave Burst
          </button>

          <div className="flex items-center justify-between px-3 py-1.5 bg-[rgba(255,255,255,0.05)] border border-[var(--border-color)] rounded-xl">
            <span className="text-xs text-[var(--text-secondary)]">Zoom</span>
            <div className="flex gap-1">
              <button
                onClick={() => setZoomLevel((z) => Math.max(5, z - 1))}
                className="w-6 h-6 bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary)] text-white rounded-lg font-bold text-xs cursor-pointer flex items-center justify-center"
              >
                +
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.min(12, z + 1))}
                className="w-6 h-6 bg-[var(--bg-secondary)] hover:bg-[var(--accent-primary)] text-white rounded-lg font-bold text-xs cursor-pointer flex items-center justify-center"
              >
                -
              </button>
            </div>
          </div>
        </div>

        {/* Live Shader Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--border-color)]">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-[var(--text-secondary)]">
              <span>Metallic Finish</span>
              <span className="text-[var(--accent-primary)]">{(metalness * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={metalness}
              onChange={(e) => setMetalness(parseFloat(e.target.value))}
              className="w-full accent-[var(--accent-primary)] cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-[var(--text-secondary)]">
              <span>Surface Roughness</span>
              <span className="text-[var(--accent-secondary)]">{(roughness * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={roughness}
              onChange={(e) => setRoughness(parseFloat(e.target.value))}
              className="w-full accent-[var(--accent-secondary)] cursor-pointer"
            />
          </div>
        </div>

        {/* Real-time Telemetry Stats Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)] text-[10px] font-mono text-[var(--text-secondary)]">
          <div>POLYGONS: <strong className="text-white">{polyCount} Triangles</strong></div>
          <div>ROTATION: <strong className="text-white">X:{rotDegrees.x}° Y:{rotDegrees.y}°</strong></div>
          <div>AUDIO SYNTH: <strong className="text-[var(--accent-primary)]">WebAudio API</strong></div>
        </div>
      </div>
    </div>
  );
}
