'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

type Location = {
  label: string
  lat: number
  lng: number
  color: string
}

const LOCATIONS: Location[] = [
  { label: 'Ningbo', lat: 29.8683, lng: 121.544, color: '#f1609a' },
  { label: 'Shanghai', lat: 31.2304, lng: 121.4737, color: '#f48f63' },
  { label: 'Hangzhou', lat: 30.2741, lng: 120.1551, color: '#8b5cf6' },
]

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lng + 180) * Math.PI) / 180
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

function isAbstractLand(lat: number, lng: number) {
  // Simple continent-like blobs for an elegant first version.
  const northAmerica = ((lng + 100) ** 2) / (48 ** 2) + ((lat - 42) ** 2) / (28 ** 2) < 1
  const southAmerica = ((lng + 60) ** 2) / (16 ** 2) + ((lat + 18) ** 2) / (34 ** 2) < 1
  const eurasia = ((lng - 20) ** 2) / (72 ** 2) + ((lat - 45) ** 2) / (27 ** 2) < 1
  const africa = ((lng - 18) ** 2) / (18 ** 2) + ((lat + 2) ** 2) / (28 ** 2) < 1
  return northAmerica || southAmerica || eurasia || africa
}

function DottedContinents() {
  const pointsRef = useRef<THREE.Points>(null)

  const { positions, colors } = useMemo(() => {
    const positionValues: number[] = []
    const colorValues: number[] = []

    for (let lat = -78; lat <= 78; lat += 2.4) {
      for (let lng = -180; lng <= 180; lng += 2.4) {
        if (!isAbstractLand(lat, lng)) continue

        const radiusJitter = 1.458 + ((lat + lng) % 7) * 0.0012
        const point = latLngToVector3(lat, lng, radiusJitter)
        positionValues.push(point.x, point.y, point.z)

        const color = new THREE.Color(lat > 0 ? '#ff8bc7' : '#ff6eaf')
        colorValues.push(color.r, color.g, color.b)
      }
    }

    return {
      positions: new Float32Array(positionValues),
      colors: new Float32Array(colorValues),
    }
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y += delta * 0.02
    pointsRef.current.rotation.z = Math.sin(performance.now() * 0.0003) * 0.03
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.018} vertexColors transparent opacity={0.98} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function GlobeScene() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.04
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.05
  })

  return (
    <group ref={groupRef} rotation={[0.08, -0.72, 0.02]}>
      <mesh>
        <sphereGeometry args={[1.46, 96, 96]} />
        <meshPhysicalMaterial
          color="#251023"
          roughness={0.28}
          metalness={0.06}
          transmission={0.28}
          thickness={0.45}
          ior={1.18}
          clearcoat={1}
          clearcoatRoughness={0.22}
          transparent
          opacity={0.82}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.5, 96, 96]} />
        <meshBasicMaterial color="#ff69b4" transparent opacity={0.16} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.54, 96, 96]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.06} blending={THREE.AdditiveBlending} />
      </mesh>

      <DottedContinents />

      {LOCATIONS.map((location) => {
        const anchor = latLngToVector3(location.lat, location.lng, 1.5)
        const labelPos = anchor.clone().multiplyScalar(1.18)
        return (
          <group key={location.label}>
            <mesh position={anchor.toArray()}>
              <sphereGeometry args={[0.045, 18, 18]} />
              <meshBasicMaterial color={location.color} />
            </mesh>
            <mesh position={anchor.toArray()}>
              <sphereGeometry args={[0.1, 18, 18]} />
              <meshBasicMaterial color={location.color} transparent opacity={0.16} blending={THREE.AdditiveBlending} />
            </mesh>
            <Html position={labelPos.toArray()} distanceFactor={8} center transform occlude={false}>
              <div
                className="pointer-events-none inline-flex items-center gap-2 rounded-full px-4 py-2 text-[1.05rem] font-black leading-none text-white shadow-[0_12px_28px_rgba(0,0,0,0.42)] md:text-[1.1rem]"
                style={{ backgroundColor: location.color }}
              >
                <span className="size-2 rounded-full bg-white/95" aria-hidden />
                {location.label}
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

export function ExperienceGlobe3D() {
  return (
    <div className="relative mx-auto w-full max-w-[620px] overflow-hidden">
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(241,96,154,0.24),rgba(17,9,18,0)_72%)] blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute inset-0 rounded-full border border-[#ff86c2]/25" aria-hidden />

      <div className="relative aspect-square w-full">
        <Canvas
          camera={{ position: [0, 0, 4.25], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#120b12']} />
          <ambientLight intensity={0.55} color="#ffd4ec" />
          <pointLight position={[4, 3, 4]} intensity={1.3} color="#ff77bb" />
          <pointLight position={[-4, -2, 2]} intensity={0.65} color="#a855f7" />
          <directionalLight position={[-2, 4, 3]} intensity={0.7} color="#ffb4da" />
          <hemisphereLight intensity={0.25} color="#ffb4da" groundColor="#120b12" />

          <Suspense fallback={null}>
            <GlobeScene />
          </Suspense>

          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minDistance={4.0}
            maxDistance={4.0}
            rotateSpeed={0.55}
            autoRotate
            autoRotateSpeed={0.42}
            enableDamping
            dampingFactor={0.08}
            minPolarAngle={Math.PI * 0.28}
            maxPolarAngle={Math.PI * 0.72}
          />
        </Canvas>
      </div>

      <p className="mt-6 text-center font-mono text-xs uppercase tracking-[0.34em] text-hero-pink/80">
        DRAG TO ROTATE GLOBE
      </p>
    </div>
  )
}
