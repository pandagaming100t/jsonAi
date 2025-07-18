
"use client";

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import * as THREE from 'three';

export default function StormBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let cloudParticles: THREE.Mesh[] = [];
    let rainParticles: THREE.Points;
    let flash: THREE.PointLight;
    let rain: THREE.Points;
    let rainGeo: THREE.BufferGeometry;
    let animationId: number;
    const rainCount = 15000;

    const init = () => {
      // Scene setup
      scene = new THREE.Scene();
      
      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      camera.position.z = 1;
      camera.rotation.x = 1.16;
      camera.rotation.y = -0.12;
      camera.rotation.z = 0.27;

      // Lighting
      const ambient = new THREE.AmbientLight(0x555555);
      scene.add(ambient);

      const directionalLight = new THREE.DirectionalLight(0xffeedd);
      directionalLight.position.set(0, 0, 1);
      scene.add(directionalLight);

      // Lightning flash
      flash = new THREE.PointLight(0x062d89, 30, 500, 1.7);
      flash.position.set(200, 300, 100);
      scene.add(flash);

      // Renderer setup
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      scene.fog = new THREE.FogExp2(
        theme === 'dark' ? 0x11111f : 0x333344, 
        0.002
      );
      renderer.setClearColor(scene.fog.color, 0.8);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.domElement.style.position = 'fixed';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      renderer.domElement.style.zIndex = '-1';
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      container.appendChild(renderer.domElement);

      // Create rain
      const positions = [];
      const sizes = [];
      rainGeo = new THREE.BufferGeometry();
      
      for (let i = 0; i < rainCount; i++) {
        positions.push(Math.random() * 400 - 200);
        positions.push(Math.random() * 500 - 250);
        positions.push(Math.random() * 400 - 200);
        sizes.push(30);
      }
      
      rainGeo.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(positions), 3)
      );
      rainGeo.setAttribute(
        'size',
        new THREE.BufferAttribute(new Float32Array(sizes), 1)
      );

      const rainMaterial = new THREE.PointsMaterial({
        color: theme === 'dark' ? 0xaaaaaa : 0x888888,
        size: 0.1,
        transparent: true
      });
      
      rain = new THREE.Points(rainGeo, rainMaterial);
      scene.add(rain);

      // Create clouds
      const cloudGeo = new THREE.PlaneGeometry(500, 500);
      const cloudMaterial = new THREE.MeshLambertMaterial({
        color: theme === 'dark' ? 0x444444 : 0x666666,
        transparent: true,
        opacity: 0.6
      });

      for (let p = 0; p < 25; p++) {
        const cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
        cloud.position.set(
          Math.random() * 800 - 400,
          500,
          Math.random() * 500 - 450
        );
        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random() * 360;
        cloud.material.opacity = 0.4;
        cloudParticles.push(cloud);
        scene.add(cloud);
      }

      animate();
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Animate clouds
      cloudParticles.forEach((p) => {
        p.rotation.z -= 0.002;
      });

      // Animate rain
      const positions = rainGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.5; // Move rain down
        if (positions[i + 1] < -250) {
          positions[i + 1] = 250; // Reset to top
        }
      }
      rainGeo.attributes.position.needsUpdate = true;

      rain.position.z -= 0.222;
      if (rain.position.z < -200) {
        rain.position.z = 0;
      }

      // Lightning effect
      if (Math.random() > 0.93 || flash.power > 100) {
        if (flash.power < 100) {
          flash.position.set(
            Math.random() * 400, 
            300 + Math.random() * 200, 
            100
          );
        }
        flash.power = 50 + Math.random() * 500;
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
      cloudParticles = [];
    };
  }, [theme]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: -1 }}
    />
  );
}
