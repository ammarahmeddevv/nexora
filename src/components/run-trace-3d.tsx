"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { HERO_RUN, TRACE_ROW, type TraceStep } from "@/lib/content";

/** px per world unit — one lane is 1 world unit tall, matching the card rows */
const ROW = TRACE_ROW;

const COLORS = {
  done: "#7f8bff",
  running: "#6fd2f7",
  retry: "#f7bd63",
  sleeping: "#4a5060",
  track: "#181b24",
  grid: "#262c3b",
};

const BAR_H = 0.42;
const BAR_D = 0.42;

function stepProgress(s: TraceStep, t: number) {
  const local = (t - s.start) / s.span;
  if (s.state === "retry") {
    if (local < 0.55) return Math.max(0, local / 0.55) * 0.62;
    if (local < 0.72) return 0.62 - ((local - 0.55) / 0.17) * 0.42;
    return Math.min(1, 0.2 + ((local - 0.72) / 0.28) * 0.8);
  }
  if (s.state === "running") return Math.min(0.82, Math.max(0, local));
  return Math.min(1, Math.max(0, local));
}

function Lane({
  step,
  index,
  count,
  trackLen,
  clock,
}: {
  step: TraceStep;
  index: number;
  count: number;
  trackLen: number;
  clock: React.RefObject<number>;
}) {
  const fill = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const tip = useRef<THREE.Mesh>(null);
  const pulse = useRef<THREE.Mesh>(null);

  const y = count / 2 - index - 0.5;
  const color = COLORS[step.state];
  const startX = step.start * trackLen;
  const fullW = Math.max(step.span * trackLen, 0.2);
  const dashCount = Math.max(2, Math.round(fullW / 0.34));

  useFrame(() => {
    const t = clock.current;
    const p = stepProgress(step, t);
    const w = Math.max(fullW * p, 0.0001);
    const now = performance.now();

    if (fill.current) {
      fill.current.scale.x = w;
      fill.current.position.x = startX + w / 2;
      fill.current.visible = p > 0.001;
      (fill.current.material as THREE.MeshBasicMaterial).opacity =
        step.state === "retry" && t >= 1
          ? 0.74 + Math.sin(now / 320) * 0.26
          : 1;
    }
    if (glow.current) {
      glow.current.scale.x = Math.max(w + 0.12, 0.0001);
      glow.current.position.x = startX + w / 2;
      glow.current.visible = p > 0.02;
    }
    if (tip.current) {
      const live = step.state === "running" && t >= 1;
      tip.current.visible = live;
      if (live) {
        tip.current.position.x = startX + w;
        tip.current.scale.setScalar(1 + Math.sin(now / 240) * 0.28);
      }
    }
    if (pulse.current) {
      const done = step.state === "done" && t >= 1.05;
      pulse.current.visible = done;
      if (done) {
        const phase = (now / 1700 + index * 0.23) % 1;
        pulse.current.position.x = startX + phase * fullW;
        (pulse.current.material as THREE.MeshBasicMaterial).opacity =
          Math.sin(phase * Math.PI) * 0.8;
      }
    }
  });

  return (
    <group position={[-trackLen / 2, y, 0]}>
      <mesh position={[startX + fullW / 2, 0, -0.02]}>
        <boxGeometry args={[fullW, BAR_H, BAR_D * 0.5]} />
        <meshBasicMaterial color={COLORS.track} toneMapped={false} />
      </mesh>

      {step.state === "sleeping" ? (
        Array.from({ length: dashCount }).map((_, i) => (
          <mesh key={i} position={[startX + 0.09 + i * 0.34, 0, 0]}>
            <boxGeometry args={[0.16, BAR_H, BAR_D]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
        ))
      ) : (
        <>
          <mesh ref={glow} position={[0, 0, -0.09]} visible={false}>
            <planeGeometry args={[1, BAR_H + 0.34]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.09}
              toneMapped={false}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
          <mesh ref={fill}>
            <boxGeometry args={[1, BAR_H, BAR_D]} />
            <meshBasicMaterial color={color} toneMapped={false} transparent />
          </mesh>
          <mesh ref={tip} visible={false}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshBasicMaterial color={color} toneMapped={false} />
          </mesh>
          <mesh ref={pulse} visible={false}>
            <sphereGeometry args={[0.07, 12, 12]} />
            <meshBasicMaterial
              color="#eef0ff"
              transparent
              opacity={0}
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

function GridFloor({ count, trackLen }: { count: number; trackLen: number }) {
  const geo = useMemo(() => {
    const pts: number[] = [];
    const h = count / 2 + 0.6;
    const cols = 10;
    for (let i = 0; i <= cols; i++) {
      const x = -trackLen / 2 + (i / cols) * trackLen;
      pts.push(x, -h, 0, x, h, 0);
    }
    for (let i = 0; i <= count; i++) {
      const yy = count / 2 - i;
      pts.push(-trackLen / 2, yy, 0, trackLen / 2, yy, 0);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [count, trackLen]);

  return (
    <lineSegments geometry={geo} position={[0, 0, -0.4]}>
      <lineBasicMaterial color={COLORS.grid} toneMapped={false} />
    </lineSegments>
  );
}

function Scene({ reduce }: { reduce: boolean }) {
  const group = useRef<THREE.Group>(null);
  const clock = useRef(reduce ? 1.7 : 0);
  const { size } = useThree();
  const steps = HERO_RUN.steps;
  const trackLen = Math.max(4, size.width / ROW - 0.7);

  useFrame((state, delta) => {
    if (reduce) {
      group.current?.rotation.set(-0.05, -0.12, 0);
      return;
    }
    clock.current = Math.min(clock.current + delta / 2.4, 1.7);
    const px = (state.pointer.x || 0) * 0.09;
    const py = (state.pointer.y || 0) * 0.05;
    const tx = -0.05 + py + Math.sin(state.clock.elapsedTime * 0.22) * 0.012;
    const ty = -0.12 + px + Math.cos(state.clock.elapsedTime * 0.18) * 0.016;
    if (group.current) {
      group.current.rotation.x += (tx - group.current.rotation.x) * 0.045;
      group.current.rotation.y += (ty - group.current.rotation.y) * 0.045;
    }
  });

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 20]} zoom={ROW} />
      <group ref={group}>
        <mesh position={[0, 0, -0.7]}>
          <planeGeometry args={[trackLen + 1.2, steps.length + 1.4]} />
          <meshBasicMaterial color="#0b0d13" toneMapped={false} />
        </mesh>
        <GridFloor count={steps.length} trackLen={trackLen} />
        {steps.map((s, i) => (
          <Lane
            key={s.name}
            step={s}
            index={i}
            count={steps.length}
            trackLen={trackLen}
            clock={clock}
          />
        ))}
      </group>
    </>
  );
}

export default function RunTrace3D() {
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <Scene reduce={reduce} />
    </Canvas>
  );
}
