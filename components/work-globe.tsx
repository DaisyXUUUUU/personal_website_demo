'use client'

import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

type Marker = {
  label: string
  lat: number
  lon: number
  color: string
}

const MARKERS: Marker[] = [
  { label: 'Ningbo', lat: 29.87, lon: 121.55, color: '#f1609a' },
  { label: 'Shanghai', lat: 31.23, lon: 121.47, color: '#f48f63' },
  { label: 'Hangzhou', lat: 30.27, lon: 120.15, color: '#8b5cf6' },
]

function latLonToVec3(lat: number, lon: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lon + 180) * Math.PI) / 180
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

function isLand(lat: number, lon: number) {
  // Americas-focused procedural mask for a cleaner silhouette.
  const naMain = ((lon + 102) ** 2) / (50 ** 2) + ((lat - 43) ** 2) / (30 ** 2) < 1
  const naWest = ((lon + 130) ** 2) / (18 ** 2) + ((lat - 50) ** 2) / (16 ** 2) < 1
  const naSouth = ((lon + 92) ** 2) / (22 ** 2) + ((lat - 22) ** 2) / (18 ** 2) < 1
  const saMain = ((lon + 60) ** 2) / (18 ** 2) + ((lat + 17) ** 2) / (36 ** 2) < 1
  const saSouth = ((lon + 67) ** 2) / (12 ** 2) + ((lat + 45) ** 2) / (14 ** 2) < 1
  return naMain || naWest || naSouth || saMain || saSouth
}

function GlobeDots({ radius = 1.45 }: { radius?: number }) {
  const { positions, colors } = useMemo(() => {
    const pos: number[] = []
    const col: number[] = []
    for (let lat = -78; lat <= 78; lat += 2.7) {
      for (let lon = -180; lon <= 180; lon += 2.7) {
        if (!isLand(lat, lon)) continue
        const p = latLonToVec3(lat, lon, radius)
        pos.push(p.x, p.y, p.z)
        const c = new THREE.Color(lat > 0 ? '#ff8bc7' : '#ff6eaf')
        col.push(c.r, c.g, c.b)
      }
    }
    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col),
    }
  }, [radius])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.017} vertexColors transparent opacity={0.98} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function GlobeCore() {
  return (
    <group rotation={[0.05, -0.48, 0]}>
      <mesh>
        <sphereGeometry args={[1.45, 96, 96]} />
        <meshPhysicalMaterial
          color="#2a1326"
          transparent
          opacity={0.74}
          roughness={0.28}
          metalness={0.05}
          transmission={0.35}
          clearcoat={1}
          clearcoatRoughness={0.2}
          thickness={0.45}
          ior={1.18}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.46, 96, 96]} />
        <meshBasicMaterial color="#ff79ba" transparent opacity={0.22} />
      </mesh>

      <GlobeDots radius={1.455} />
    </group>
  )
}

export function WorkGlobe() {
  return (
    <div className="relative mx-auto aspect-square w-[92%] max-w-[560px]">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[#f1609a]/30 blur-[78px]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 rounded-full border border-[#ff8ec7]/35" aria-hidden />

      <Canvas camera={{ position: [0, 0, 4.4], fov: 42 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#0f0811']} />
        <fog attach="fog" args={['#0f0811', 4.5, 8]} />

        <ambientLight intensity={0.55} color="#ffb9dd" />
        <directionalLight position={[4, 3, 3]} intensity={1.1} color="#ffd7ea" />
        <pointLight position={[-3, -1, 3]} intensity={0.9} color="#ff5ca9" />

        <Suspense fallback={null}>
          <GlobeCore />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI * 0.28}
          maxPolarAngle={Math.PI * 0.72}
          rotateSpeed={0.65}
          autoRotate
          autoRotateSpeed={0.52}
          dampingFactor={0.08}
          enableDamping
        />
      </Canvas>

      <div className="pointer-events-none absolute right-[4%] top-1/2 z-20 flex -translate-y-1/2 flex-col gap-5">
        {MARKERS.map((marker) => (
          <div key={marker.label} className="flex items-center gap-2.5">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: marker.color, boxShadow: `0 0 10px ${marker.color}` }}
              aria-hidden
            />
            <span className="h-px w-7 bg-white/35" aria-hidden />
            <span
              className="inline-flex rounded-full px-4 py-2 text-[2.05rem] font-black leading-none text-white shadow-[0_10px_24px_rgba(0,0,0,0.45)] md:text-[2.15rem]"
              style={{ backgroundColor: marker.color }}
            >
              {marker.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
