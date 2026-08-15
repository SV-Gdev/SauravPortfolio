'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ----------------------------------------------------
    // Scene & Camera Setup
    // ----------------------------------------------------
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0c16, 0.0012);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1200
    );
    camera.position.set(0, 0, 450);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0c16, 0.5);
    container.appendChild(renderer.domElement);

    // ----------------------------------------------------
    // 1. Ambient Particle Field (Cyan & Purple Stars)
    // ----------------------------------------------------
    const particleCount = 850;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x00d4ff);
    const purpleColor = new THREE.Color(0x8b5cf6);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1800;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1800;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1800;

      const mixedColor = Math.random() > 0.5 ? cyanColor : purpleColor;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Glow Canvas Texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.4, 'rgba(0,212,255,0.8)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 7,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const ambientParticles = new THREE.Points(geometry, material);
    scene.add(ambientParticles);

    // ----------------------------------------------------
    // 2. Interactive Cursor Particle Trail
    // ----------------------------------------------------
    const trailCount = 120;
    const trailGeo = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(trailCount * 3);
    const trailOpacities = new Float32Array(trailCount);
    let trailHeadIndex = 0;

    for (let i = 0; i < trailCount; i++) {
      trailPositions[i * 3] = 9999;
      trailPositions[i * 3 + 1] = 9999;
      trailPositions[i * 3 + 2] = 9999;
      trailOpacities[i] = 0;
    }

    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

    const trailMat = new THREE.PointsMaterial({
      color: 0x00d4ff,
      size: 10,
      map: texture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const trailParticles = new THREE.Points(trailGeo, trailMat);
    scene.add(trailParticles);

    // ----------------------------------------------------
    // 3. Cyber Wireframe Undulating Wave Surface
    // ----------------------------------------------------
    const planeGeo = new THREE.PlaneGeometry(1600, 1000, 48, 32);
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const waveMesh = new THREE.Mesh(planeGeo, planeMat);
    waveMesh.rotation.x = -Math.PI / 2.2;
    waveMesh.position.set(0, -320, -100);
    scene.add(waveMesh);

    // Store original plane vertex positions for wave calculations
    const posAttribute = planeGeo.attributes.position;
    const originalZ = new Float32Array(posAttribute.count);
    for (let i = 0; i < posAttribute.count; i++) {
      originalZ[i] = posAttribute.getZ(i);
    }

    // ----------------------------------------------------
    // 4. Floating 3D Polyhedrons / Crystals
    // ----------------------------------------------------
    const floatingGroup = new THREE.Group();

    const crystalMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    const crystalGeos = [
      new THREE.OctahedronGeometry(45, 0),
      new THREE.IcosahedronGeometry(55, 0),
      new THREE.TetrahedronGeometry(35, 0),
    ];

    const crystalMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < 6; i++) {
      const geo = crystalGeos[i % crystalGeos.length];
      const mesh = new THREE.Mesh(geo, crystalMat);
      mesh.position.set(
        (Math.random() - 0.5) * 1200,
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 600 - 100
      );
      floatingGroup.add(mesh);
      crystalMeshes.push(mesh);
    }

    scene.add(floatingGroup);

    // ----------------------------------------------------
    // Mouse Tracking & Interaction
    // ----------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.25;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.25;

      // Project mouse position into 3D world coords for particle trail
      const vector = new THREE.Vector3(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        0.5
      );
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));

      // Add point to particle trail
      const posAttr = trailGeo.attributes.position as THREE.BufferAttribute;
      posAttr.setXYZ(trailHeadIndex, pos.x, pos.y, pos.z + 50);
      posAttr.needsUpdate = true;

      trailHeadIndex = (trailHeadIndex + 1) % trailCount;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // ----------------------------------------------------
    // Animation Loop
    // ----------------------------------------------------
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera lerp
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      camera.position.x = targetX;
      camera.position.y = -targetY;
      camera.lookAt(scene.position);

      // Rotate ambient particle cloud
      ambientParticles.rotation.y = elapsedTime * 0.02;
      ambientParticles.rotation.x = elapsedTime * 0.01;

      // Animate Cyber Wave Surface
      const posAttr = planeGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < posAttr.count; i++) {
        const u = posAttr.getX(i);
        const v = posAttr.getY(i);
        const z =
          Math.sin(u * 0.01 + elapsedTime * 1.5) * 25 +
          Math.cos(v * 0.01 + elapsedTime * 1.2) * 20;
        posAttr.setZ(i, originalZ[i] + z);
      }
      posAttr.needsUpdate = true;

      // Rotate Floating Polyhedrons
      crystalMeshes.forEach((mesh, idx) => {
        mesh.rotation.x = elapsedTime * (0.1 + idx * 0.03);
        mesh.rotation.y = elapsedTime * (0.15 + idx * 0.02);
        mesh.position.y += Math.sin(elapsedTime * 0.8 + idx) * 0.3;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      texture.dispose();
      trailGeo.dispose();
      trailMat.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      crystalMat.dispose();
      crystalGeos.forEach((g) => g.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
}
