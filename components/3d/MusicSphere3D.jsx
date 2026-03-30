'use client'
import { useRef, useMemo, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

/**
 * MusicSphere3D — Glass sphere with orbiting rings and music symbols.
 *
 * Features:
 *  - Transparent glass sphere center with refraction-like material
 *  - Orbiting rings at various angles
 *  - Small music note symbols placed along rings
 *  - Lazy-loaded, SSR-safe, respects prefers-reduced-motion
 *
 * Props:
 *  - color (string): primary color, default '#F5C518'
 *  - accentColor (string): ring/accent color, default '#2560E8'
 *  - ringCount (number): number of orbiting rings, default 3
 *  - noteCount (number): music symbols per ring, default 4
 *  - speed (number): rotation speed multiplier, default 1
 *  - className, style
 */

function MusicSphere3DInner({
  color = '#F5C518',
  accentColor = '#2560E8',
  ringCount = 3,
  noteCount = 4,
  speed = 1,
}) {
  const { Canvas, useFrame } = require('@react-three/fiber')
  const { Float } = require('@react-three/drei')
  const THREE = require('three')

  function GlassSphere() {
    const meshRef = useRef()

    useFrame((state) => {
      if (!meshRef.current) return
      meshRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.03
      )
    })

    return (
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.1}
          roughness={0.05}
          transmission={0.85}
          thickness={1.5}
          ior={1.5}
          transparent
          opacity={0.35}
          emissive={color}
          emissiveIntensity={0.05}
          envMapIntensity={1}
        />
      </mesh>
    )
  }

  function InnerCore() {
    const meshRef = useRef()

    useFrame((state) => {
      if (!meshRef.current) return
      meshRef.current.rotation.y += 0.01 * speed
      meshRef.current.rotation.x += 0.005 * speed
      const pulse = 0.4 + Math.sin(state.clock.elapsedTime * 1.2) * 0.1
      meshRef.current.scale.setScalar(pulse)
    })

    return (
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.4}
          wireframe
        />
      </mesh>
    )
  }

  function OrbitRing({ radius, tiltX, tiltZ, ringColor, notesOnRing, rotSpeed }) {
    const groupRef = useRef()

    useFrame((state) => {
      if (!groupRef.current) return
      groupRef.current.rotation.y += 0.003 * rotSpeed
    })

    // Create ring points for note placement
    const notePositions = useMemo(() => {
      return Array.from({ length: notesOnRing }, (_, i) => {
        const angle = (i / notesOnRing) * Math.PI * 2
        return {
          x: Math.cos(angle) * radius,
          y: 0,
          z: Math.sin(angle) * radius,
          angle,
        }
      })
    }, [radius, notesOnRing])

    return (
      <group ref={groupRef} rotation={[tiltX, 0, tiltZ]}>
        {/* Ring torus */}
        <mesh>
          <torusGeometry args={[radius, 0.015, 16, 100]} />
          <meshStandardMaterial
            color={ringColor}
            metalness={0.8}
            roughness={0.15}
            emissive={ringColor}
            emissiveIntensity={0.15}
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Music note symbols on ring */}
        {notePositions.map((pos, i) => (
          <MiniNote
            key={i}
            position={[pos.x, pos.y, pos.z]}
            color={i % 2 === 0 ? color : accentColor}
            speed={speed}
          />
        ))}
      </group>
    )
  }

  function MiniNote({ position, color: noteColor, speed: noteSpeed }) {
    const groupRef = useRef()

    useFrame((state) => {
      if (!groupRef.current) return
      groupRef.current.rotation.y += 0.02 * noteSpeed
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.08
    })

    return (
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <group ref={groupRef} position={position} scale={0.12}>
          {/* Note head */}
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color={noteColor}
              metalness={0.8}
              roughness={0.15}
              emissive={noteColor}
              emissiveIntensity={0.3}
            />
          </mesh>
          {/* Stem */}
          <mesh position={[0.25, 0.8, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 1.6, 8]} />
            <meshStandardMaterial
              color={noteColor}
              metalness={0.7}
              roughness={0.2}
              emissive={noteColor}
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      </Float>
    )
  }

  const rings = useMemo(() => {
    return Array.from({ length: ringCount }, (_, i) => ({
      radius: 1.8 + i * 0.5,
      tiltX: (i * Math.PI) / ringCount + 0.3,
      tiltZ: (i * 0.4) - 0.2,
      ringColor: i % 2 === 0 ? color : accentColor,
      rotSpeed: speed * (1 + i * 0.3),
      notesOnRing: noteCount,
    }))
  }, [ringCount, color, accentColor, speed, noteCount])

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color={color} />
      <pointLight position={[-5, -3, -5]} intensity={0.6} color={accentColor} />
      <spotLight
        position={[0, 8, 4]}
        angle={0.3}
        intensity={0.8}
        penumbra={0.5}
        color="#ffffff"
      />

      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
        <GlassSphere />
        <InnerCore />
        {rings.map((ring, i) => (
          <OrbitRing
            key={i}
            radius={ring.radius}
            tiltX={ring.tiltX}
            tiltZ={ring.tiltZ}
            ringColor={ring.ringColor}
            notesOnRing={ring.notesOnRing}
            rotSpeed={ring.rotSpeed}
          />
        ))}
      </Float>
    </Canvas>
  )
}

const Scene = dynamic(() => Promise.resolve(MusicSphere3DInner), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%' }} />,
})

export default function MusicSphere3D({
  color = '#F5C518',
  accentColor = '#2560E8',
  ringCount = 3,
  noteCount = 4,
  speed = 1,
  className = '',
  style = {},
}) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (reducedMotion) return null

  return (
    <div
      ref={ref}
      className={`kc-3d-music-sphere ${className}`}
      style={{
        width: '100%',
        height: 400,
        ...style,
      }}
    >
      {visible && (
        <Scene
          color={color}
          accentColor={accentColor}
          ringCount={ringCount}
          noteCount={noteCount}
          speed={speed}
        />
      )}
    </div>
  )
}
