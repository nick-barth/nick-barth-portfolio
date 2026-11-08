"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles, Text3D, useAnimations, useGLTF } from "@react-three/drei";
import { initTypingActivity, onSubmission, typingState } from "./typingActivity";

function makeWormCurve(seed: number) {
  const rand = mulberry32(seed);
  const length = 4 + rand() * 3;
  const points: THREE.Vector3[] = [];
  let x = 0;
  let y = 0;
  let z = 0;
  const segments = 6;
  for (let i = 0; i <= segments; i++) {
    x += (rand() - 0.5) * (length / segments) * 1.6;
    y += (rand() - 0.5) * (length / segments) * 1.6;
    z += (rand() - 0.5) * (length / segments) * 0.6;
    points.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(points);
}

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WORM_COLORS = ["#e0a899", "#d88b7a", "#c97b6c", "#b9634f", "#e6b7ab", "#a85a4a"];

type WormProps = {
  seed: number;
  position: [number, number, number];
  scale: number;
  radius: number;
};

function Worm({ seed, position, scale, radius }: WormProps) {
  const group = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const phase = useMemo(() => seed * 12.9898, [seed]);
  const speed = useMemo(() => 0.4 + mulberry32(seed)() * 0.6, [seed]);
  const color = WORM_COLORS[seed % WORM_COLORS.length];
  const glitchCycle = useMemo(() => 3.5 + (seed % 7) * 0.6, [seed]);
  const glitchOffset = useMemo(() => mulberry32(seed + 1)() * 10, [seed]);

  const geometry = useMemo(() => {
    const curve = makeWormCurve(seed);
    return new THREE.TubeGeometry(curve, 24, radius, 8, false);
  }, [seed, radius]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.x = Math.sin(t * speed + phase) * 0.35;
    group.current.rotation.y = Math.cos(t * speed * 0.7 + phase) * 0.5;
    group.current.rotation.z = Math.sin(t * speed * 0.5 + phase * 1.3) * 0.25;
    group.current.position.y = position[1] + Math.sin(t * speed * 0.8 + phase) * 0.08;

    if (matRef.current) {
      const phaseInCycle = (t + glitchOffset) % glitchCycle;
      const glitching = phaseInCycle < 0.1;
      matRef.current.emissiveIntensity = glitching ? 2.2 : 0;
    }
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          ref={matRef}
          color={color}
          roughness={0.55}
          metalness={0.05}
          emissive="#a855f7"
          emissiveIntensity={0}
        />
      </mesh>
    </group>
  );
}

function Bucket() {
  return (
    <group position={[0, -2.4, 0]}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[2.1, 1.6, 2.4, 32, 1, true]} />
        <meshStandardMaterial
          color="#2b2b30"
          roughness={0.4}
          metalness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -1.18, 0]}>
        <cylinderGeometry args={[1.6, 1.6, 0.08, 32]} />
        <meshStandardMaterial color="#232326" roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh position={[0, 1.2, 0]}>
        <torusGeometry args={[2.1, 0.07, 12, 40]} />
        <meshStandardMaterial color="#3a3a40" roughness={0.35} metalness={0.7} />
      </mesh>
    </group>
  );
}

function useSmokeTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "rgba(255,255,255,0.85)");
    gradient.addColorStop(0.4, "rgba(200,200,200,0.35)");
    gradient.addColorStop(1, "rgba(200,200,200,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);
}

type SmokeParticleProps = {
  basePosition: [number, number, number];
  index: number;
  texture: THREE.Texture | null;
};

function SmokeParticle({ basePosition, index, texture }: SmokeParticleProps) {
  const ref = useRef<THREE.Sprite>(null);
  const rand = useMemo(() => mulberry32(index * 53 + 7), [index]);
  const offset = useMemo(() => rand() * 4, [rand]);
  const driftX = useMemo(() => (rand() - 0.5) * 0.2, [rand]);
  const driftZ = useMemo(() => (rand() - 0.5) * 0.2, [rand]);
  const life = 2.6;

  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime + offset) % life;
    const p = t / life;
    ref.current.position.set(
      basePosition[0] + driftX * p,
      basePosition[1] + p * 0.9,
      basePosition[2] + driftZ * p
    );
    const scale = 0.06 + p * 0.22;
    ref.current.scale.set(scale, scale, 1);
    const material = ref.current.material as THREE.SpriteMaterial;
    material.opacity = Math.sin(p * Math.PI) * 0.5;
  });

  if (!texture) return null;

  return (
    <sprite ref={ref}>
      <spriteMaterial map={texture} color="#9a9a9a" transparent depthWrite={false} />
    </sprite>
  );
}

function SmokingEye({ position }: { position: [number, number, number] }) {
  const texture = useSmokeTexture();
  const particles = useMemo(() => Array.from({ length: 8 }, (_, i) => i), []);

  return (
    <>
      {particles.map((i) => (
        <SmokeParticle key={i} index={i} basePosition={position} texture={texture} />
      ))}
    </>
  );
}

function useMoonTexture() {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2;

    const base = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
    base.addColorStop(0, "#ff6b4a");
    base.addColorStop(0.45, "#c81e2c");
    base.addColorStop(1, "#5c0f14");
    ctx.fillStyle = base;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    const rand = mulberry32(42);
    ctx.globalCompositeOperation = "multiply";
    for (let i = 0; i < 14; i++) {
      const angle = rand() * Math.PI * 2;
      const dist = rand() * r * 0.8;
      const bx = cx + Math.cos(angle) * dist;
      const by = cy + Math.sin(angle) * dist;
      const br = r * (0.05 + rand() * 0.12);
      const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      grad.addColorStop(0, "rgba(80,10,15,0.5)");
      grad.addColorStop(1, "rgba(80,10,15,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";

    return new THREE.CanvasTexture(canvas);
  }, []);
}

// Anchors its children to a fraction of the actual visible viewport at a
// given depth, recomputed every frame from the live camera/aspect ratio —
// unlike a fixed world-space position, this keeps "corner" elements
// (moon, arms) actually in their corner across any aspect ratio, instead of
// clipping out of frame on narrow/portrait viewports.
function CornerAnchor({
  z,
  xFrac,
  yFrac,
  children,
}: {
  z: number;
  xFrac: number;
  yFrac: number;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const vp = state.viewport.getCurrentViewport(state.camera, [0, 0, z]);
    group.current.position.set((vp.width / 2) * xFrac, (vp.height / 2) * yFrac, z);
  });

  return <group ref={group}>{children}</group>;
}

function BloodMoon({ position }: { position: [number, number, number] }) {
  // Swap `moonTexture` for a loaded asset texture here later if you get one
  // (e.g. useTexture("/textures/moon.jpg")) — everything else stays the same.
  const moonTexture = useMoonTexture();
  const haloTexture = useSmokeTexture();
  const moonRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (moonRef.current) moonRef.current.rotation.y += delta * 0.01;
  });

  return (
    <group position={position}>
      <sprite scale={[13, 13, 1]}>
        <spriteMaterial map={haloTexture} color="#ff2d1f" transparent opacity={0.3} depthWrite={false} fog={false} />
      </sprite>
      <sprite scale={[6.8, 6.8, 1]}>
        <spriteMaterial map={haloTexture} color="#ff6a4a" transparent opacity={0.55} depthWrite={false} fog={false} />
      </sprite>

      <mesh ref={moonRef}>
        <sphereGeometry args={[2.1, 32, 32]} />
        <meshStandardMaterial
          map={moonTexture}
          emissive="#b3241f"
          emissiveMap={moonTexture}
          emissiveIntensity={1.4}
          roughness={0.9}
          metalness={0}
          fog={false}
        />
      </mesh>

      <pointLight color="#ff3b30" intensity={14} distance={22} />
    </group>
  );
}

const SPHINX_TARGET_HEIGHT = 7.5;
// The source scan's facing direction isn't labeled in the file, so this
// assumes the model faces +Z after Sketchfab's export transform. If the
// glowing/smoking eyes land on the back of the head instead of the face,
// flip EYE_FRONT_Z to -1 and re-check.
const EYE_FRONT_Z = 1;

function SphinxModel() {
  const { scene } = useGLTF("/models/sphinx.glb");

  const { model, eyePositions, babyEyePositions } = useMemo(() => {
    const clone = scene.clone(true);

    // First pass: measure the raw import to get a scale factor.
    const rawBox = new THREE.Box3().setFromObject(clone);
    const rawSize = new THREE.Vector3();
    rawBox.getSize(rawSize);
    const scale = SPHINX_TARGET_HEIGHT / (rawSize.y || 1);
    clone.scale.setScalar(scale);

    // Second pass: re-measure at final scale to center it and place eyes.
    clone.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    clone.position.x -= center.x;
    clone.position.z -= center.z;
    clone.position.y -= box.min.y;

    const eyeY = box.min.y + size.y * 0.86 - box.min.y; // relative to new floor-at-0
    const eyeZ = EYE_FRONT_Z * size.z * 0.46;
    const eyeXOffset = size.x * 0.12;

    // The baby figure is held low, between the front paws.
    const babyEyeY = size.y * 0.14;
    const babyEyeZ = EYE_FRONT_Z * size.z * 0.52;
    const babyEyeXOffset = size.x * 0.05;

    return {
      model: clone,
      eyePositions: [
        [-eyeXOffset, eyeY, eyeZ] as [number, number, number],
        [eyeXOffset, eyeY, eyeZ] as [number, number, number],
      ],
      babyEyePositions: [
        [-babyEyeXOffset, babyEyeY, babyEyeZ] as [number, number, number],
        [babyEyeXOffset, babyEyeY, babyEyeZ] as [number, number, number],
      ],
    };
  }, [scene]);

  const eyeLight = useRef<THREE.PointLight>(null);
  const eyeLight2 = useRef<THREE.PointLight>(null);
  const babyEyeLight = useRef<THREE.PointLight>(null);
  const babyEyeLight2 = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 2.2 + Math.sin(t * 1.2) * 1.2;
    if (eyeLight.current) eyeLight.current.intensity = pulse * 2.5;
    if (eyeLight2.current) eyeLight2.current.intensity = pulse * 2.5;
    const babyPulse = 1.8 + Math.sin(t * 1.7 + 1.5) * 1.1;
    if (babyEyeLight.current) babyEyeLight.current.intensity = babyPulse * 2;
    if (babyEyeLight2.current) babyEyeLight2.current.intensity = babyPulse * 2;
  });

  const allEyePositions = [...eyePositions, ...babyEyePositions];

  return (
    <>
      <primitive object={model} />

      {allEyePositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[i < 2 ? 0.06 : 0.035, 12, 12]} />
          <meshStandardMaterial color="#ffb347" emissive="#ff4d1a" emissiveIntensity={2.2} />
        </mesh>
      ))}
      <pointLight ref={eyeLight} position={eyePositions[0]} color="#ff7a1a" intensity={5} distance={4} />
      <pointLight ref={eyeLight2} position={eyePositions[1]} color="#ff7a1a" intensity={5} distance={4} />
      <pointLight ref={babyEyeLight} position={babyEyePositions[0]} color="#ff7a1a" intensity={3} distance={2.5} />
      <pointLight ref={babyEyeLight2} position={babyEyePositions[1]} color="#ff7a1a" intensity={3} distance={2.5} />

      <SmokingEye position={[eyePositions[0][0], eyePositions[0][1] + 0.15, eyePositions[0][2]]} />
      <SmokingEye position={[eyePositions[1][0], eyePositions[1][1] + 0.15, eyePositions[1][2]]} />
      <SmokingEye position={[babyEyePositions[0][0], babyEyePositions[0][1] + 0.1, babyEyePositions[0][2]]} />
      <SmokingEye position={[babyEyePositions[1][0], babyEyePositions[1][1] + 0.1, babyEyePositions[1][2]]} />
    </>
  );
}

useGLTF.preload("/models/sphinx.glb");

function Sphinx() {
  return (
    <group position={[-1.6, -2.6, -4.6]} rotation={[0, -0.6, 0]}>
      <Suspense fallback={null}>
        <SphinxModel />
      </Suspense>
    </group>
  );
}

const CAMERA_GLITCH_CYCLE = 7.3;
const CAMERA_GLITCH_DURATION = 0.16;

const DESKTOP_VFOV_DEG = 50;
// The scene's corner elements (moon, arms, sphinx) were placed assuming
// roughly this aspect ratio. On a narrower (portrait) viewport, a fixed
// vertical FOV collapses the horizontal frustum and those elements clip out
// of frame entirely, so we widen the vertical FOV to keep the horizontal
// field of view roughly constant, capped to avoid extreme fisheye distortion.
const REFERENCE_ASPECT = 1.7;
const MAX_VFOV_DEG = 85;

function CameraRig() {
  const { size } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const baseX = Math.sin(t * 0.15) * 0.7;
    const baseY = Math.cos(t * 0.11) * 0.3 + 0.2;
    const baseZ = 6.5 + Math.sin(t * 0.08) * 0.5;

    const aspect = size.width / size.height;
    let baseVfov = DESKTOP_VFOV_DEG;
    if (aspect < REFERENCE_ASPECT) {
      const targetHFovRad = 2 * Math.atan(Math.tan(((DESKTOP_VFOV_DEG * Math.PI) / 180) / 2) * REFERENCE_ASPECT);
      const vfovRad = 2 * Math.atan(Math.tan(targetHFovRad / 2) / aspect);
      baseVfov = Math.min(MAX_VFOV_DEG, (vfovRad * 180) / Math.PI);
    }

    const cycleIndex = Math.floor(t / CAMERA_GLITCH_CYCLE);
    const phase = t % CAMERA_GLITCH_CYCLE;
    const camera = state.camera as THREE.PerspectiveCamera;

    if (phase < CAMERA_GLITCH_DURATION) {
      const g = mulberry32(cycleIndex * 991 + 7);
      camera.position.set(
        baseX + (g() - 0.5) * 2.4,
        baseY + (g() - 0.5) * 1.5,
        baseZ + (g() - 0.5) * 1.6
      );
      camera.fov = baseVfov + (g() - 0.5) * 26;
      camera.lookAt((g() - 0.5) * 3, (g() - 0.5) * 2, -2);
    } else {
      camera.position.set(baseX, baseY, baseZ);
      camera.fov = baseVfov;
      camera.lookAt(0, 0.3, -2);
    }
    camera.updateProjectionMatrix();
  });
  return null;
}

function FlickerLight({
  position,
  color,
  intensity,
  distance,
}: {
  position: [number, number, number];
  color: string;
  intensity: number;
  distance?: number;
}) {
  const ref = useRef<THREE.PointLight>(null);
  const seed = useMemo(() => Math.floor(Math.random() * 100000), []);
  const targetRef = useRef(intensity);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const step = Math.floor((t + seed) * 3);
    const rand = mulberry32(step + seed)();
    targetRef.current = intensity * (0.7 + rand * 0.55);
    ref.current.intensity += (targetRef.current - ref.current.intensity) * 0.18;
  });

  return (
    <pointLight
      ref={ref}
      position={position}
      color={color}
      intensity={intensity}
      distance={distance}
    />
  );
}

const EYE_UNISON_CYCLE = 9;
const EYE_UNISON_STARE_WINDOW = 1.4;

function FloatingEye({
  position,
  scale = 1,
  seed = 0,
}: {
  position: [number, number, number];
  scale?: number;
  seed?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const pupilLight = useRef<THREE.PointLight>(null);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;

    const unisonPhase = t % EYE_UNISON_CYCLE;
    const staring = unisonPhase > EYE_UNISON_CYCLE - EYE_UNISON_STARE_WINDOW;

    if (staring) {
      target.set(0, 0.3, 6.5);
    } else {
      target.set(
        Math.sin(t * 0.32 + seed) * 4.2,
        Math.cos(t * 0.26 + seed * 1.7) * 2.6,
        6
      );
    }
    group.current.lookAt(target);

    const blinkCycle = (t * 0.5 + seed * 3.1) % 5.5;
    const blink = blinkCycle > 5.3 ? 0.05 : 1;
    group.current.scale.set(scale, scale * blink, scale);

    if (pupilLight.current) {
      pupilLight.current.intensity = staring ? 6 : 2.5;
    }
  });

  return (
    <group ref={group} position={position}>
      <mesh>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial color="#f6f4ec" roughness={0.25} />
      </mesh>
      <mesh position={[0, 0, 0.19]}>
        <sphereGeometry args={[0.1, 14, 14]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
      <mesh position={[0, 0, 0.23]}>
        <sphereGeometry args={[0.038, 10, 10]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2.4} />
      </mesh>
      <pointLight ref={pupilLight} position={[0, 0, 0.3]} color="#a855f7" intensity={2.5} distance={2.5} />
    </group>
  );
}

function FloatingEyes() {
  const eyes = useMemo(
    () => [
      { position: [-4.4, 2.6, 1.6] as [number, number, number], scale: 1, seed: 0.4 },
      { position: [4.8, 1.3, 0.9] as [number, number, number], scale: 0.82, seed: 2.1 },
      { position: [-3.1, -1.6, 2.3] as [number, number, number], scale: 0.62, seed: 4.6 },
      { position: [3.2, 3.8, -0.4] as [number, number, number], scale: 0.55, seed: 6.2 },
      { position: [-5.5, -0.4, -0.8] as [number, number, number], scale: 0.7, seed: 8.0 },
    ],
    []
  );

  return (
    <>
      {eyes.map((e, i) => (
        <FloatingEye key={i} {...e} />
      ))}
    </>
  );
}

function DriftingBackdrop() {
  const { scene } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const hue = (0.08 + Math.sin(t * 0.05) * 0.03 + 1) % 1;
    const color = new THREE.Color().setHSL(hue, 0.4, 0.06);
    if (scene.background instanceof THREE.Color) scene.background.copy(color);
    const fog = scene.fog as THREE.Fog | null;
    if (fog) fog.color.copy(color);
  });

  return null;
}

function Worms() {
  const worms = useMemo(() => {
    const list: WormProps[] = [];
    for (let i = 0; i < 34; i++) {
      const rand = mulberry32(i * 97 + 13);
      const inBucket = i < 26;
      const angle = rand() * Math.PI * 2;
      const radial = inBucket ? rand() * 1.3 : 1.3 + rand() * 1.6;
      list.push({
        seed: i * 7 + 3,
        position: [
          Math.cos(angle) * radial,
          inBucket ? -1.2 + rand() * 1.4 : -3.1 + rand() * 0.3,
          Math.sin(angle) * radial * 0.6 + (inBucket ? 0 : 0.8),
        ],
        scale: 0.22 + rand() * 0.22,
        radius: 0.14 + rand() * 0.06,
      });
    }
    return list;
  }, []);

  return (
    <>
      {worms.map((w) => (
        <Worm key={w.seed} {...w} />
      ))}
    </>
  );
}

type FingerProps = {
  position: [number, number, number];
  rotationY: number;
  lengths: [number, number, number];
  phase: number;
  fingerIndex: number;
  fingerCount: number;
};

function Finger({ position, rotationY, lengths, phase, fingerIndex, fingerCount }: FingerProps) {
  const seg1 = useRef<THREE.Group>(null);
  const seg2 = useRef<THREE.Group>(null);
  const seg3 = useRef<THREE.Group>(null);
  const radius = 0.045;
  const lastHandledSeq = useRef(0);
  const tapUntilRef = useRef(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // react to real keystrokes: each keydown is assigned to one finger,
    // round-robin, which then does a sharp tap.
    if (typingState.seq !== lastHandledSeq.current) {
      if (typingState.seq % fingerCount === fingerIndex) {
        tapUntilRef.current = t + 0.13;
      }
      lastHandledSeq.current = typingState.seq;
    }

    const idleTwitch = Math.sin(t * 1.3 + phase) * 0.1 + Math.sin(t * 5.4 + phase * 2) * 0.04;
    // faint idle tapping so the hand isn't frozen when nobody's typing
    const idleCycle = 2.4 + (phase % 3) * 0.4;
    const idlePhase = (t + phase * 2) % idleCycle;
    const idleTap = idlePhase < 0.09 ? 0.35 : 0;
    const realTap = t < tapUntilRef.current ? 1.1 : 0;

    const curl = 0.2 + idleTwitch + Math.max(idleTap, realTap);
    // slow whip-like undulation, growing toward the tip, like a worm writhing
    const wave1 = Math.sin(t * 2.1 + phase) * 0.1;
    const wave2 = Math.sin(t * 2.1 + phase + 0.55) * 0.17;
    const wave3 = Math.sin(t * 2.1 + phase + 1.1) * 0.24;

    if (seg1.current) {
      seg1.current.rotation.x = curl;
      seg1.current.rotation.z = wave1;
    }
    if (seg2.current) {
      seg2.current.rotation.x = curl * 1.4;
      seg2.current.rotation.z = wave2;
    }
    if (seg3.current) {
      seg3.current.rotation.x = curl * 1.6;
      seg3.current.rotation.z = wave3;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group ref={seg1}>
        <mesh position={[0, lengths[0] / 2, 0]}>
          <capsuleGeometry args={[radius, lengths[0], 4, 8]} />
          <meshStandardMaterial color="#c08a72" roughness={0.5} metalness={0.05} />
        </mesh>
        <group position={[0, lengths[0], 0]} ref={seg2}>
          <mesh position={[0, lengths[1] / 2, 0]}>
            <capsuleGeometry args={[radius * 0.85, lengths[1], 4, 8]} />
            <meshStandardMaterial color="#cc9683" roughness={0.5} metalness={0.05} />
          </mesh>
          <group position={[0, lengths[1], 0]} ref={seg3}>
            <mesh position={[0, lengths[2] / 2, 0]}>
              <capsuleGeometry args={[radius * 0.7, lengths[2], 4, 8]} />
              <meshStandardMaterial color="#d8a48f" roughness={0.5} metalness={0.05} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

const HAND_FINGERS: {
  rotationY: number;
  x: number;
  lengths: [number, number, number];
  phase: number;
}[] = [
  { rotationY: -0.55, x: -0.16, lengths: [0.16, 0.11, 0.08], phase: 0.4 },
  { rotationY: -0.22, x: -0.07, lengths: [0.2, 0.13, 0.09], phase: 1.8 },
  { rotationY: 0.05, x: 0.02, lengths: [0.21, 0.14, 0.1], phase: 3.1 },
  { rotationY: 0.3, x: 0.1, lengths: [0.19, 0.12, 0.09], phase: 4.6 },
  { rotationY: 0.75, x: 0.19, lengths: [0.13, 0.09, 0.07], phase: 5.9 },
];

function Keyboard() {
  const keys = useMemo(() => {
    const list: [number, number][] = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 6; col++) {
        list.push([col, row]);
      }
    }
    return list;
  }, []);

  return (
    <group position={[0, 0.09, 0.24]} rotation={[-0.25, 0, 0]}>
      <mesh>
        <boxGeometry args={[0.5, 0.03, 0.32]} />
        <meshStandardMaterial color="#2a2a2e" roughness={0.5} metalness={0.3} />
      </mesh>
      {keys.map(([col, row], i) => (
        <mesh key={i} position={[-0.21 + col * 0.08, 0.022, -0.12 + row * 0.075]}>
          <boxGeometry args={[0.062, 0.015, 0.062]} />
          <meshStandardMaterial color="#3d3d42" roughness={0.6} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function CreepyHand({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const palmMat = useRef<THREE.MeshStandardMaterial>(null);
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    initTypingActivity();
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.position.y = position[1] + Math.sin(t * 0.6) * 0.03;
      group.current.rotation.z = rotation[2] + Math.sin(t * 0.4) * 0.015;
    }
    if (palmMat.current) {
      const cycle = 5.2;
      const phase = t % cycle;
      palmMat.current.emissiveIntensity = phase < 0.12 ? 1.6 : 0;
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <mesh position={[0, -0.35, 0]} rotation={[0.15, 0, 0]}>
        <cylinderGeometry args={[0.13, 0.16, 0.6, 12]} />
        <meshStandardMaterial color="#c3b1a0" roughness={0.65} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.42, 0.28, 0.16]} />
        <meshStandardMaterial
          ref={palmMat}
          color="#cdbba9"
          roughness={0.6}
          metalness={0.05}
          emissive="#a855f7"
          emissiveIntensity={0}
        />
      </mesh>

      {HAND_FINGERS.map((f, i) => (
        <Finger
          key={i}
          position={[f.x, 0.2, 0]}
          rotationY={f.rotationY}
          lengths={f.lengths}
          phase={f.phase}
          fingerIndex={i}
          fingerCount={HAND_FINGERS.length}
        />
      ))}

      <Keyboard />
    </group>
  );
}

const ARMS_TARGET_WIDTH = 3.6;
// The FPS-viewmodel's "reach" axis isn't labeled in the file. This guesses the
// arms extend along local +Z, rotated here so they reach up/toward camera
// from the lower-right corner. If they're pointing the wrong way, adjust
// ARMS_ROTATION.
const ARMS_ROTATION: [number, number, number] = [-Math.PI / 2.4, 0.3, 0];
const ARMS_POSE = "Fists Pose";

function ArmsModel() {
  const { scene, animations } = useGLTF("/models/arms.glb");
  const { actions } = useAnimations(animations, scene);

  const normalized = useMemo(() => {
    const rawBox = new THREE.Box3().setFromObject(scene);
    const rawSize = new THREE.Vector3();
    rawBox.getSize(rawSize);
    const scale = ARMS_TARGET_WIDTH / (rawSize.x || 1);
    scene.scale.setScalar(scale);

    scene.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);

    scene.position.x -= center.x;
    scene.position.z -= center.z;
    scene.position.y -= box.min.y;

    return scene;
  }, [scene]);

  useEffect(() => {
    const action = actions[ARMS_POSE];
    action?.reset().fadeIn(0.4).play();
    return () => {
      action?.fadeOut(0.2);
    };
  }, [actions]);

  return <primitive object={normalized} />;
}

useGLTF.preload("/models/arms.glb");

const ARMS_Z = 4.6;

function Arms() {
  // Close foreground corner placement (viewmodel-style), anchored to a
  // fraction of the actual viewport at this depth so it stays in the corner
  // across aspect ratios instead of a fixed world-space offset (which, at
  // this close a distance to the camera, clips out of frame very easily).
  return (
    <CornerAnchor z={ARMS_Z} xFrac={0.62} yFrac={-0.62}>
      <group rotation={ARMS_ROTATION}>
        <Suspense fallback={null}>
          <ArmsModel />
        </Suspense>
      </group>
    </CornerAnchor>
  );
}

const LETTER_FONT = "/fonts/helvetiker_bold.typeface.json";
const LETTER_HOLD_DURATION = 1.2; // held readable before falling apart
const LETTER_FALL_LIFETIME = 4.5; // time-to-live once it starts falling
const LETTER_FADE_START = 3;
const LETTER_SPACING = 0.34;
const LETTER_READING_Y = 0.5;
const LETTER_READING_Z = 2.4;

type LetterEntry = { id: string; char: string; seed: number; x: number };

function FloatingLetter({
  char,
  seed,
  x,
  onExpire,
}: {
  char: string;
  seed: number;
  x: number;
  onExpire: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const startTime = useRef<number | null>(null);
  const expired = useRef(false);

  const { velocity, angularVel, color } = useMemo(() => {
    const rand = mulberry32(seed);
    return {
      velocity: new THREE.Vector3((rand() - 0.5) * 2.6, rand() * 1.6 + 1.1, (rand() - 0.5) * 1.9),
      angularVel: new THREE.Vector3((rand() - 0.5) * 5, (rand() - 0.5) * 5, (rand() - 0.5) * 5),
      color: WORM_COLORS[Math.floor(rand() * WORM_COLORS.length)],
    };
  }, [seed]);

  useFrame((state, delta) => {
    if (startTime.current === null) startTime.current = state.clock.elapsedTime;
    const age = state.clock.elapsedTime - startTime.current;

    if (!group.current) return;

    if (age < LETTER_HOLD_DURATION) {
      // held in place, readable, briefly fading in
      group.current.position.set(x, LETTER_READING_Y, LETTER_READING_Z);
      group.current.rotation.set(0, 0, 0);
      if (matRef.current) matRef.current.opacity = Math.min(1, age / 0.3);
      return;
    }

    const fallAge = age - LETTER_HOLD_DURATION;

    if (fallAge > LETTER_FALL_LIFETIME) {
      if (!expired.current) {
        expired.current = true;
        onExpire();
      }
      return;
    }

    velocity.y -= delta * 2.4;
    group.current.position.addScaledVector(velocity, delta);
    group.current.rotation.x += angularVel.x * delta;
    group.current.rotation.y += angularVel.y * delta;
    group.current.rotation.z += angularVel.z * delta;

    if (matRef.current) {
      matRef.current.opacity =
        fallAge < LETTER_FADE_START
          ? 1
          : Math.max(0, 1 - (fallAge - LETTER_FADE_START) / (LETTER_FALL_LIFETIME - LETTER_FADE_START));
    }
  });

  return (
    <group ref={group} position={[x, LETTER_READING_Y, LETTER_READING_Z]}>
      <Text3D
        font={LETTER_FONT}
        size={0.38}
        height={0.1}
        bevelEnabled
        bevelThickness={0.018}
        bevelSize={0.012}
        curveSegments={4}
      >
        {char}
        <meshStandardMaterial
          ref={matRef}
          color={color}
          transparent
          opacity={0}
          roughness={0.35}
          metalness={0.2}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </Text3D>
    </group>
  );
}

function FloatingLetters3D() {
  const [letters, setLetters] = useState<LetterEntry[]>([]);

  useEffect(() => {
    return onSubmission((s) => {
      const chars = Array.from(s.text).slice(0, 30);
      if (chars.length === 0) return;
      const totalWidth = (chars.length - 1) * LETTER_SPACING;
      const startX = -totalWidth / 2;

      const entries: LetterEntry[] = [];
      chars.forEach((ch, i) => {
        if (ch === " ") return;
        entries.push({
          id: `${s.id}-${i}`,
          char: ch,
          seed: s.id * 97 + i * 13 + 3,
          x: startX + i * LETTER_SPACING,
        });
      });
      setLetters((prev) => [...prev, ...entries].slice(-90));
    });
  }, []);

  return (
    <>
      {letters.map((l) => (
        <FloatingLetter
          key={l.id}
          char={l.char}
          seed={l.seed}
          x={l.x}
          onExpire={() => setLetters((prev) => prev.filter((entry) => entry.id !== l.id))}
        />
      ))}
    </>
  );
}

function Scene({ isMobile }: { isMobile: boolean }) {
  return (
    <>
      <color attach="background" args={["#171009"]} />
      <fog attach="fog" args={["#171009", 5, 18]} />
      <DriftingBackdrop />
      <CameraRig />

      <ambientLight intensity={0.5} />
      <FlickerLight position={[3, 4, 4]} color="#ffb347" intensity={45} />
      <FlickerLight position={[-4, 2, 3]} color="#ff6b6b" intensity={25} />
      <FlickerLight position={[0, -3, 2]} color="#e0a899" intensity={20} />
      <FlickerLight position={[-1.6, 2, -3.9]} color="#ff8c1a" intensity={35} />

      <Sparkles count={isMobile ? 30 : 70} scale={9} size={2} speed={0.25} color="#e0a899" opacity={0.4} />

      <CornerAnchor z={-9} xFrac={0.68} yFrac={0.62}>
        <BloodMoon position={[0, 0, 0]} />
      </CornerAnchor>

      <Sphinx />
      <Bucket />
      <Worms />
      <FloatingEyes />
      <CreepyHand position={[1.3, -0.6, 1.4]} rotation={[0.15, 0.35, 0]} scale={2.2} />
      <Arms />
      <FloatingLetters3D />
    </>
  );
}

export function WormBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0.2, 6.5], fov: 50 }}
      dpr={isMobile ? 1 : [1, 1.5]}
      gl={{ antialias: !isMobile }}
    >
      <Scene isMobile={isMobile} />
    </Canvas>
  );
}
