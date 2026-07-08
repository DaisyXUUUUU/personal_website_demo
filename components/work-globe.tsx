'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls, Stars } from '@react-three/drei'
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
  // Abstract continent masks for a dotted globe aesthetic.
  const northAmerica = lat > 8 && lat < 72 && lon > -170 && lon < -50
  const southAmerica = lat > -56 && lat < 14 && lon > -86 && lon < -32
  const eurasia = lat > 6 && lat < 78 && lon > -12 && lon < 170
  const africa = lat > -35 && lat < 37 && lon > -20 && lon < 52
  const australia = lat > -44 && lat < -10 && lon > 112 && lon < 154
  return northAmerica || southAmerica || eurasia || africa || australia
}

function GlobeDots({ radius = 1.45 }: { radius?: number }) {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const pos: number[] = []
    const col: number[] = []
    for (let lat = -80; lat <= 80; lat += 3) {
      for (let lon = -180; lon <= 180; lon += 3) {
        if (!isLand(lat, lon)) continue
        const p = latLonToVec3(lat, lon, radius)
        pos.push(p.x, p.y, p.z)
        const c = new THREE.Color(lat > 0 ? '#ff83c0' : '#ff6ca8')
        col.push(c.r, c.g, c.b)
      }
    }
    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col),
    }
  }, [radius])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y += delta * 0.03
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors transparent opacity={0.95} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function GlobeCore() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.07
  })

  return (
    <group ref={groupRef}>
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
        <meshBasicMaterial color="#ff79ba" transparent opacity={0.25} />
      </mesh>

      <GlobeDots radius={1.455} />

      {MARKERS.map((marker) => {
        const anchor = latLonToVec3(marker.lat, marker.lon, 1.47)
        const labelPos = anchor.clone().multiplyScalar(1.22)
        return (
          <group key={marker.label}>
            <mesh position={anchor.toArray()}>
              <sphereGeometry args={[0.03, 16, 16]} />
              <meshBasicMaterial color={marker.color} />
            </mesh>
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([
                    anchor.x,
                    anchor.y,
                    anchor.z,
                    labelPos.x,
                    labelPos.y,
                    labelPos.z,
                  ])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color={marker.color} transparent opacity={0.65} />
            </line>
            <Html position={labelPos.toArray()} center distanceFactor={8} transform occlude={false}>
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-black text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
                style={{ backgroundColor: marker.color }}
              >
                {marker.label}
              </span>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

export function WorkGlobe() {
  return (
    <div className="relative mx-auto aspect-square w-[92%] max-w-[560px]">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[#f1609a]/25 blur-[80px]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 rounded-full border border-[#ff8ec7]/35" aria-hidden />

      <Canvas camera={{ position: [0, 0, 4.4], fov: 42 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#0f0811']} />
        <fog attach="fog" args={['#0f0811', 4.5, 8]} />

        <ambientLight intensity={0.55} color="#ffb9dd" />
        <directionalLight position={[4, 3, 3]} intensity={1.1} color="#ffd7ea" />
        <pointLight position={[-3, -1, 3]} intensity={0.9} color="#ff5ca9" />

        <Suspense fallback={null}>
          <Stars radius={12} depth={20} count={500} factor={2.2} saturation={0} fade speed={0.4} />
          <GlobeCore />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI * 0.28}
          maxPolarAngle={Math.PI * 0.72}
          rotateSpeed={0.58}
          autoRotate
          autoRotateSpeed={0.4}
          dampingFactor={0.08}
          enableDamping
        />
      </Canvas>
    </div>
  )
}
