
"use client";

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import * as THREE from 'three';

export default function EarthAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    let earth: THREE.Mesh;
    let atmosphere: THREE.Mesh;
    let animationId: number;

    const init = () => {
      // Scene setup
      scene = new THREE.Scene();
      
      // Camera setup
      camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.set(3, 1, 2);

      // Renderer setup
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 3, 5);
      scene.add(directionalLight);

      // Create Earth geometry
      const earthGeometry = new THREE.SphereGeometry(1, 64, 64);

      // Create Earth material with basic colors (since we don't have textures)
      const earthMaterial = new THREE.MeshPhongMaterial({
        color: theme === 'dark' ? 0x2563eb : 0x1e40af, // Blue earth
        shininess: 100,
        transparent: true,
        opacity: 0.9,
      });

      // Add some surface detail with a basic pattern
      const wireframeGeometry = new THREE.SphereGeometry(1.01, 32, 32);
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: theme === 'dark' ? 0x60a5fa : 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
      });
      const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
      scene.add(wireframe);

      earth = new THREE.Mesh(earthGeometry, earthMaterial);
      scene.add(earth);

      // Create atmosphere effect
      const atmosphereGeometry = new THREE.SphereGeometry(1.1, 64, 64);
      const atmosphereMaterial = new THREE.MeshBasicMaterial({
        color: theme === 'dark' ? 0x00d4ff : 0x87ceeb,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
      });
      atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      scene.add(atmosphere);

      // Add some stars in the background
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({
        color: theme === 'dark' ? 0xffffff : 0x888888,
        size: 1,
        transparent: true,
        opacity: 0.8,
      });

      const starsVertices = [];
      for (let i = 0; i < 1000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
      }

      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);

      // Add some floating particles around Earth
      const particlesGeometry = new THREE.BufferGeometry();
      const particlesMaterial = new THREE.PointsMaterial({
        color: theme === 'dark' ? 0x60a5fa : 0x3b82f6,
        size: 2,
        transparent: true,
        opacity: 0.6,
      });

      const particlesVertices = [];
      for (let i = 0; i < 200; i++) {
        const radius = 1.5 + Math.random() * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        particlesVertices.push(x, y, z);
      }

      particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlesVertices, 3));
      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);

      // Mouse interaction
      let mouseX = 0;
      let mouseY = 0;

      const handleMouseMove = (event: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      };

      container.addEventListener('mousemove', handleMouseMove);

      // Animation loop
      const animate = () => {
        animationId = requestAnimationFrame(animate);

        // Rotate Earth
        earth.rotation.y += 0.005;
        wireframe.rotation.y += 0.005;
        atmosphere.rotation.y += 0.002;

        // Rotate particles
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;

        // Mouse interaction - subtle camera movement
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        // Pulse atmosphere
        const time = Date.now() * 0.001;
        atmosphere.material.opacity = 0.1 + Math.sin(time) * 0.05;

        renderer.render(scene, camera);
      };

      animate();

      // Handle resize
      const handleResize = () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };

      window.addEventListener('resize', handleResize);

      // Cleanup function
      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        if (renderer) {
          renderer.dispose();
        }
      };
    };

    const cleanup = init();

    return cleanup;
  }, [theme]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      {/* Optional overlay text */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground opacity-50">
        Interactive 3D Earth
      </div>
    </div>
  );
}
