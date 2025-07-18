"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function EarthBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let earth: THREE.Mesh;
    let animationId: number;

    const init = () => {
      // Scene setup
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 2.5);

      // Renderer setup
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 1);
      renderer.domElement.style.position = 'fixed';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.zIndex = '-1';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      // Create Earth
      const geometry = new THREE.SphereGeometry(1, 64, 64);

      // Create earth material with texture-like appearance
      const material = new THREE.MeshPhongMaterial({
        color: 0x2233ff,
        shininess: 100,
        specular: 0x222222,
      });

      // Add some variation to make it look more earth-like
      const earthTexture = createEarthTexture();
      material.map = earthTexture;

      earth = new THREE.Mesh(geometry, material);
      scene.add(earth);

      // Add atmosphere glow
      const atmosphereGeometry = new THREE.SphereGeometry(1.1, 64, 64);
      const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide,
      });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      scene.add(atmosphere);

      animate();
    };

    const createEarthTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const context = canvas.getContext('2d')!;

      // Create a simple earth-like pattern
      const gradient = context.createLinearGradient(0, 0, 512, 256);
      gradient.addColorStop(0, '#1e40af');
      gradient.addColorStop(0.3, '#3b82f6');
      gradient.addColorStop(0.5, '#22c55e');
      gradient.addColorStop(0.7, '#84cc16');
      gradient.addColorStop(1, '#1e40af');

      context.fillStyle = gradient;
      context.fillRect(0, 0, 512, 256);

      // Add some random "continents"
      context.fillStyle = '#16a34a';
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const radius = Math.random() * 30 + 10;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate the earth
      if (earth) {
        earth.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    init();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: -1 }}
    />
  );
}