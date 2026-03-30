'use client'
import { useRef, useMemo, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

/**
 * MusicNote3D — 3D orbiting music notes using Three.js / R3F.
 * Lazy-loaded, SSR-safe, respects prefers-reduced-motion.
 *
 * Props:
 *  - noteCount (number): number of orbiting notes, default 8
 *  - showGlow (boolean): show center glow sphere, default true
 *  - className, style
 */

/* Inner scene — only imported client-side */
function MusicNote3DInner({ noteCount = 8, showGlow = true }) {
  const { Canvas, useFrame } = require('@react-three/fiber')
  const { Float } = require('@react-three/drei')
  const THREE = require('three')

  function NoteShape({ position = [0, 0, 0], scale = 1, color = '#F5C518', speed = 1 }) {
    const group = useRef()
    useFrame((state) => {
      if (group.current) {
        group.current.rotation.y += 0.008 * speed
        group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 * speed) * 0.15
      }
    })
    return (
      <Float speed={1.5 * speed} rotationIntensity={0.3} floatIntensity={0.6}>
        <group ref={group} position={position} scale={scale}>
          <mesh position={[0, 0, 0]} rotation={[0, 0, -0.3]}>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.15} emissive={color} emissiveIntensity={0.15} />
          </mesh>
          <mesh position={[0.3, 1.0, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 2.0, 12]} />
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} emissive={color} emissiveIntensity={0.1} />
          </mesh>
          <mesh position={[0.3, 1.9, 0]} rotation={[0, 0, -0.5]}>
            <torusGeometry args={[0.25, 0.04, 8, 16, Math.PI * 0.8]} />
            <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} emissive={color} emissiveIntensity={0.1} />
          </mesh>
        </group>
      </Float>
    )
  }

  function OrbitingNotes({ count = 6, radius = 3.5 }) {
    const groupRef = useRef()
    const notes = useMemo(() =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2
        return {
          x: Math.cos(angle) * radius,
          y: (Math.random() - 0.5) * 2,
          z: Math.sin(angle) * radius,
          scale: 0.15 + Math.random() * 0.15,
          speed: 0.6 + Math.random() * 0.8,
        }
      }), [count, radius])

    useFrame((state) => {
      if (groupRef.current) {
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.08
      }
    })

    return (
      <group ref={groupRef}>
        {notes.map((n, i) => (
          <NoteShape key={i} position={[n.x, n.y, n.z]} scale={n.scale} speed={n.speed} />
        ))}
      </group>
    )
  }

  function GlowSphere() {
    const meshRef = useRef()
    useFrame((state) => {
      if (meshRef.current) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05)
      }
    })
    return (
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshStandardMaterial
          color="#F5C518"
          metalness={0.9}
          roughness={0.1}
          emissive="#F5C518"
          emissiveIntensity={0.3}
          transparent
          opacity={0.3}
        />
      </mesh>
    )
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#F5C518" />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#2560E8" />
      <OrbitingNotes count={noteCount} />
      {showGlow && <GlowSphere />}
    </Canvas>
  )
}

/* Dynamic import — no SSR */
const Scene = dynamic(
  () => Promise.resolve(MusicNote3DInner),
  { ssr: false, loading: () => <div style={{ width: '100%', height: '100%' }} /> }
)

export default function MusicNote3D({
  noteCount = 8,
  showGlow = true,
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

  // Lazy-load on intersection
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
      className={`kc-3d-scene ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        ...style,
      }}
    >
      {visible && <Scene noteCount={noteCount} showGlow={showGlow} />}
    </div>
  )
}
