'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Hero3DCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  // Controls & HUD state
  const [wireframe, setWireframe] = useState(false);
  const [neonPulse, setNeonPulse] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [engineMode, setEngineMode] = useState<'Unity C#' | 'Unreal C++'>('Unity C#');
  const [rotDegrees, setRotDegrees] = useState({ x: 0, y: 0, z: 0 });
  const [fps, setFps] = useState(60);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const coreMeshRef = useRef<THREE.Mesh | null>(null);
  const outerWireRef = useRef<THREE.Mesh | null>(null);
  const innerGeoRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const speedRef = useRef(1);
  const wireframeRef = useRef(false);
  const neonPulseRef = useRef(true);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    wireframeRef.current = wireframe;
    if (outerWireRef.current && outerWireRef.current.material) {
      (outerWireRef.current.material as THREE.MeshBasicMaterial).wireframe = wireframe;
    }
    if (coreMeshRef.current && coreMeshRef.current.material) {
      (coreMeshRef.current.material as THREE.MeshStandardMaterial).wireframe = wireframe;
    }
  }, [wireframe]);

  useEffect(() => {
    neonPulseRef.current = neonPulse;
  }, [neonPulse]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 480;
    const height = mount.clientHeight || 480;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    mount.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x00d4ff, 3, 20);
    cyanPointLight.position.set(5, 5, 5);
    scene.add(cyanPointLight);

    const purplePointLight = new THREE.PointLight(0x8b5cf6, 3, 20);
    purplePointLight.position.set(-5, -5, -5);
    scene.add(purplePointLight);

    // Core 3D Geometry: Icosahedron / Cyber Core
    const geometry = new THREE.IcosahedronGeometry(2.2, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0x0a0c16,
      roughness: 0.15,
      metalness: 0.9,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.25,
      wireframe: false,
    });
    materialRef.current = material;

    const coreMesh = new THREE.Mesh(geometry, material);
    coreMeshRef.current = coreMesh;
    scene.add(coreMesh);

    // Outer Wireframe Shell
    const outerGeo = new THREE.IcosahedronGeometry(2.6, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const outerWire = new THREE.Mesh(outerGeo, outerMat);
    outerWireRef.current = outerWire;
    scene.add(outerWire);

    // Inner Glowing Core Octahedron
    const innerGeo = new THREE.OctahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerGeoRef.current = innerMesh;
    scene.add(innerMesh);

    // Orbiting Particles Ring
    const ringCount = 120;
    const ringGeo = new THREE.BufferGeometry();
    const ringPositions = new Float32Array(ringCount * 3);
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      const radius = 3.5 + Math.random() * 0.4;
      ringPositions[i * 3] = Math.cos(angle) * radius;
      ringPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      ringPositions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPositions, 3));
    const ringMat = new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 0.08,
      transparent: true,
      opacity: 0.9,
    });
    const ringParticles = new THREE.Points(ringGeo, ringMat);
    scene.add(ringParticles);

    // Mouse Interaction (Click & Drag 3D Rotation)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      if (coreMeshRef.current) {
        coreMeshRef.current.rotation.y += deltaX * 0.01;
        coreMeshRef.current.rotation.x += deltaY * 0.01;
      }
      if (outerWireRef.current) {
        outerWireRef.current.rotation.y += deltaX * 0.01;
        outerWireRef.current.rotation.x += deltaY * 0.01;
      }

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
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

    // Render loop
    let animId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // FPS tracking
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      // Auto rotation
      const currentSpeed = speedRef.current;
      if (!isDragging && coreMeshRef.current) {
        coreMeshRef.current.rotation.y += delta * 0.4 * currentSpeed;
        coreMeshRef.current.rotation.x += delta * 0.2 * currentSpeed;

        if (outerWireRef.current) {
          outerWireRef.current.rotation.y -= delta * 0.3 * currentSpeed;
          outerWireRef.current.rotation.z += delta * 0.1 * currentSpeed;
        }

        if (innerGeoRef.current) {
          innerGeoRef.current.rotation.y += delta * 0.8 * currentSpeed;
          innerGeoRef.current.rotation.x -= delta * 0.4 * currentSpeed;
        }

        ringParticles.rotation.y = elapsedTime * 0.2 * currentSpeed;
      }

      // Neon Pulse
      if (neonPulseRef.current && materialRef.current) {
        const pulse = Math.sin(elapsedTime * 3) * 0.25 + 0.35;
        materialRef.current.emissiveIntensity = pulse;
      }

      // Update rotation degrees state for HUD display
      if (coreMeshRef.current) {
        setRotDegrees({
          x: Math.round((coreMeshRef.current.rotation.x * (180 / Math.PI)) % 360),
          y: Math.round((coreMeshRef.current.rotation.y * (180 / Math.PI)) % 360),
          z: Math.round((coreMeshRef.current.rotation.z * (180 / Math.PI)) % 360),
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
      geometry.dispose();
      material.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, []);

  const handleResetCamera = () => {
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.set(0, 0, 0);
    }
    if (outerWireRef.current) {
      outerWireRef.current.rotation.set(0, 0, 0);
    }
  };

  const toggleEngineMode = () => {
    const nextMode = engineMode === 'Unity C#' ? 'Unreal C++' : 'Unity C#';
    setEngineMode(nextMode);
    if (materialRef.current) {
      if (nextMode === 'Unreal C++') {
        materialRef.current.color.setHex(0x1a0f2e);
        materialRef.current.emissive.setHex(0x8b5cf6);
        materialRef.current.metalness = 1.0;
        materialRef.current.roughness = 0.05;
      } else {
        materialRef.current.color.setHex(0x0a0c16);
        materialRef.current.emissive.setHex(0x00d4ff);
        materialRef.current.metalness = 0.9;
        materialRef.current.roughness = 0.15;
      }
    }
  };

  return (
    <div className="relative w-full max-w-[500px] aspect-square mx-auto flex flex-col items-center justify-center">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-full rounded-3xl overflow-hidden relative shadow-[0_0_50px_rgba(0,212,255,0.2)] border border-[rgba(0,212,255,0.2)] bg-[rgba(10,12,22,0.6)] backdrop-blur-md"
      />

      {/* Floating HUD Stats Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 p-3 bg-[rgba(0,0,0,0.7)] backdrop-blur-md rounded-xl border border-[var(--border-color)] text-[10px] font-mono text-[var(--text-secondary)] pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-[var(--accent-primary)] font-bold">3D ENGINE RUNNING</span>
        </div>
        <div>FPS: <strong className="text-white">{fps}</strong></div>
        <div>ROT: X:{rotDegrees.x}° Y:{rotDegrees.y}° Z:{rotDegrees.z}°</div>
        <div>SHADER: <strong className="text-[var(--accent-secondary)]">{engineMode}</strong></div>
        <div>VERTICES: 120 (Mesh Subdiv 0)</div>
      </div>

      {/* Interactive Controls Overlay Bar */}
      <div className="mt-4 w-full flex flex-wrap items-center justify-between gap-2 p-3 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-[var(--shadow-card)] z-10">
        <button
          onClick={() => setWireframe(!wireframe)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
            wireframe
              ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
              : 'bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-white'
          }`}
        >
          🔮 {wireframe ? 'Solid' : 'Wireframe'}
        </button>

        <button
          onClick={() => setNeonPulse(!neonPulse)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
            neonPulse
              ? 'bg-[var(--accent-secondary)] text-white border-[var(--accent-secondary)]'
              : 'bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] border-[var(--border-color)] hover:text-white'
          }`}
        >
          ⚡ {neonPulse ? 'Pulse ON' : 'Pulse OFF'}
        </button>

        <button
          onClick={toggleEngineMode}
          className="px-3 py-1.5 text-xs font-semibold bg-[rgba(0,212,255,0.1)] text-[var(--accent-primary)] border border-[rgba(0,212,255,0.3)] rounded-lg hover:bg-[var(--accent-primary)] hover:text-white transition-all cursor-pointer font-mono"
        >
          🎮 Mode: {engineMode}
        </button>

        <button
          onClick={handleResetCamera}
          className="px-3 py-1.5 text-xs font-semibold bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] border border-[var(--border-color)] rounded-lg hover:text-white transition-all cursor-pointer"
        >
          🎯 Reset 3D
        </button>
      </div>
    </div>
  );
}
