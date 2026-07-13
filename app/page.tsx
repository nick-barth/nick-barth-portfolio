"use client";

import { Canvas } from "@react-three/fiber";
import { Text, OrbitControls, Float } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";

function DataToRevenueScene() {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      let animationFrame: number;
      const animate = () => {
        if (groupRef.current) {
          groupRef.current.rotation.y += 0.002;
        }
        animationFrame = requestAnimationFrame(animate);
      };
      animate();
      return () => cancelAnimationFrame(animationFrame);
    }
  }, []);

  return (
    <group ref={groupRef}>
      {/* DATA text */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Text
          position={[-3, 2, 0]}
          fontSize={2}
          font="/fonts/MaziusDisplay-Bold.woff2"
          fontWeight="bold"
          color="#000"
        >
          DATA
        </Text>
      </Float>

      {/* Arrow with animation */}
      <group>
        <mesh position={[0, 0, 0]}>
          <coneGeometry args={[0.4, 1.5, 32]} />
          <meshStandardMaterial
            color="#ff006e"
            emissive="#ff006e"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 2, 32]} />
          <meshStandardMaterial
            color="#ff006e"
            emissive="#ff006e"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>

      {/* REVENUE text */}
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1}>
        <Text
          position={[3, -2, 0]}
          fontSize={2}
          font="/fonts/MaziusDisplay-Bold.woff2"
          fontWeight="bold"
          color="#000"
        >
          REVENUE
        </Text>
      </Float>

      {/* Decorative particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 3,
          ]}
        >
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial
            color={Math.random() > 0.5 ? "#00f5ff" : "#ff006e"}
            emissive={Math.random() > 0.5 ? "#00f5ff" : "#ff006e"}
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-zinc-950 text-black dark:text-white relative">
      {/* Header */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 md:top-16 md:left-16 z-10">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-black mb-2"
          style={{
            fontFamily: "var(--font-mazius)",
            fontWeight: "700",
            lineHeight: "1.1",
          }}
        >
          Nick Barth
        </h1>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300">
          Growth Engineer at{" "}
          <a
            href="https://personio.com"
            target="_blank"
            className="font-medium hover:text-black dark:hover:text-white transition-colors underline"
          >
            Personio
          </a>
          , based out of Utrecht, NL.
        </p>
      </div>

      {/* Navigation */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 md:top-16 md:right-16 flex flex-col sm:flex-row gap-4 sm:gap-8 text-xs sm:text-sm font-medium text-right z-10">
        <a
          href="/blog"
          className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
        >
          Blog
        </a>
        <a
          href="https://www.linkedin.com/in/nicholasbarth/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
        >
          LinkedIn
        </a>
        <a
          href="/nick_barth_growth_engineer.pdf"
          download
          className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
        >
          Resume
        </a>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ width: "100%", height: "100vh" }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <pointLight position={[-10, -10, 10]} intensity={0.3} color="#00f5ff" />
        <pointLight position={[0, 0, 5]} intensity={0.4} color="#ff006e" />
        <DataToRevenueScene />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
