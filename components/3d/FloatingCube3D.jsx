'use client'
import { useRef, useMemo, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

/**
 * FloatingCube3D — 3D gold cube with ambient particle system and music-themed details.
 *
 * Features:
 *  - Metallic gold cube that rotates and bobs
 *  - Orbiting music-themed particles (small spheres representing notes)
 *  - Glowing edges and light bloom feel
 *  - Lazy-loaded, SSR-safe, respects prefers-reduced-motion
 *
 * Props:
 *  - color (string): cube color, default '#F5C518'
 *  - accentColor (string): particle/accent color, default '#2560E8'
 *  - particleCount (number): orbiting particles, default 24
 *  - speed (number): rotation speed multiplier, default 1
 *  - cubeSize (number): cube scale, default 1
 *  - className, style
 */

function FloatingCube3DInner({
  color = '#F5C518',
  accentColor = '#2560E8',
  particleCount = 24,
  speed = 1,
  cubeSize = 1,
}) {
  const { Canvas, useFrame } = require('@react-three/fiber')
  const { Float, RoundedBox } = require('@react-three/drei')

  function GoldCube({ cubeColor, size, rotSpeed }) {
    const meshRef = useRef()
    const edgesRef = useRef()

    useFrame((state) => {
      if (!meshRef.current) return
      meshRef.current.rotation.y += 0.006 * rotSpeed
      meshRef.current.rotation.x += 0.003 * rotSpeed
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    })

    return (
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.3}>
        <group ref={meshRef} scale={size}>
          {/* Main cube body */}
          <RoundedBox args={[2, 2, 2]} radius={0.15} smoothness={4}>
            <meshPhysicalMaterial
              color={cubeColor}
              metalness={0.9}
              roughness={0.1}
              clearcoat={1}
              clearcoatRoughness={0.05}
              emissive={cubeColor}
              emissiveIntensity={0.08}
              reflectivity={1}
            />
          </RoundedBox>

          {/* Wireframe overlay for edge glow */}
          <RoundedBox args={[2.02, 2.02, 2.02]} radius={0.15} smoothness={4}>
            <meshBasicMaterial
              color={cubeColor}
              wireframe
              transparent
              opacity={0.25}
            />
          </RoundedBox>

          {/* Inner glow mesh */}
          <mesh scale={1.8}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={cubeColor}
              emissive={cubeColor}
              emissiveIntensity={0.3}
              transparent
              opacity={0.05}
            />
          </mesh>

          {/* Face accent - small music note emboss on one face */}
          <mesh position={[0, 0, 1.01]}>
            <circleGeometry args={[0.25, 32]} />
            <meshStandardMaterial
              color={accentColor}
              metalness={0.8}
              roughness={0.2}
              emissive={accentColor}
              emissiveIntensity={0.2}
            />
          </mesh>
        </group>
      </Float>
    )
  }

  function ParticleField({ count, particleColor, accentCol, orbitSpeed }) {
    const groupRef = useRef()

    const particles = useMemo(() => {
      let seed = 123
      function rand() {
        seed = (seed * 16807) % 2147483647
        return (seed - 1) / 2147483646
      }
      return Array.from({ length: count }, (_, i) => {
        const theta = rand() * Math.PI * 2
        const phi = Math.acos(2 * rand() - 1)
        const r = 2.5 + rand() * 2.0
        return {
          x: r * Math.sin(phi) * Math.cos(theta),
          y: r * Math.sin(phi) * Math.sin(theta),
          z: r * Math.cos(phi),
          size: 0.02 + rand() * 0.04,
          speed: 0.5 + rand() * 1.0,
          phase: rand() * Math.PI * 2,
          isAccent: rand() > 0.6,
        }
      })
    }, [count])

    useFrame((state) => {
      if (!groupRef.current) return
      groupRef.current.rotation.y += 0.002 * orbitSpeed
      groupRef.current.rotation.x += 0.001 * orbitSpeed
    })

    return (
      <group ref={groupRef}>
        {particles.map((p, i) => (
          <ParticleNote
            key={i}
            basePos={[p.x, p.y, p.z]}
            size={p.size}
            speed={p.speed}
            phase={p.phase}
            color={p.isAccent ? accentCol : particleColor}
          />
        ))}
      </group>
    )
  }

  function ParticleNote({ basePos, size, speed: noteSpeed, phase, color: noteColor }) {
    const meshRef = useRef()

    useFrame((state) => {
      if (!meshRef.current) return
      const t = state.clock.elapsedTime * noteSpeed + phase
      meshRef.current.position.x = basePos[0] + Math.sin(t) * 0.3
      meshRef.current.position.y = basePos[1] + Math.cos(t * 0.7) * 0.2
      meshRef.current.position.z = basePos[2] + Math.sin(t * 0.5) * 0.15
      meshRef.current.scale.setScalar(
        1 + Math.sin(t * 2) * 0.3
      )
    })

    return (
      <mesh ref={meshRef} position={basePos}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshStandardMaterial
          color={noteColor}
          metalness={0.8}
          roughness={0.2}
          emissive={noteColor}
          emissiveIntensity={0.5}
        />
      </mesh>
    )
  }

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
      <pointLight position={[0, -5, 3]} intensity={0.4} color="#ffffff" />
      <spotLight
        position={[0, 8, 4]}
        angle={0.4}
        intensity={0.8}
        penumbra={0.6}
        color="#ffffff"
      />

      <GoldCube cubeColor={color} size={cubeSize} rotSpeed={speed} />
      <ParticleField
        count={particleCount}
        particleColor={color}
        accentCol={accentColor}
        orbitSpeed={speed}
      />
    </Canvas>
  )
}

const Scene = dynamic(() => Promise.resolve(FloatingCube3DInner), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%' }} />,
})

export default function FloatingCube3D({
  color = '#F5C518',
  accentColor = '#2560E8',
  particleCount = 24,
  speed = 1,
  cubeSize = 1,
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
      className={`kc-3d-floating-cube ${className}`}
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
          particleCount={particleCount}
          speed={speed}
          cubeSize={cubeSize}
        />
      )}
    </div>
  )
}
