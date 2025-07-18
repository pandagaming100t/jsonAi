"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

export function EarthEmbed() {
  const groupRef = useRef<THREE.Group>(null);
  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.scale, {
        x: 2.7,
        y: 2.7,
        z: 2.7,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(groupRef.current.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(groupRef.current.position, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, []);
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });
  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#f5ed0a" metalness={1} roughness={0} />
      </mesh>
    </group>
  );
}
