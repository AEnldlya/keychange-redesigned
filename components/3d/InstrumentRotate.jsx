'use client'
import { useRef, useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

/**
 * InstrumentRotate — 3D rotating instrument model using Three.js / R3F.
 *
 * Renders a procedural 3D guitar-like instrument that slowly rotates.
 * Lazy-loaded, SSR-safe, respects prefers-reduced-motion.
 *
 * Props:
 *  - speed (number): rotation speed multiplier, default 1
 *  - color (string): instrument body color, default '#F5C518'
 *  - accentColor (string): accent/string color, default '#2560E8'
 *  - autoRotate (boolean): enable auto rotation, default true
 *  - className, style
 */

function InstrumentRotateInner({ speed = 1, color = '#F5C518', accentColor = '#2560E8', autoRotate = true }) {
  const { Canvas, useFrame } = require('@react-three/fiber')
  const { Float, OrbitControls } = require('@react-three/drei')

  function GuitarModel({ bodyColor, stringColor, rotationSpeed }) {
    const group = useRef()

    useFrame((state) => {
      if (!group.current || !autoRotate) return
      group.current.rotation.y += 0.005 * rotationSpeed
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
    })

    return (
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        <group ref={group} scale={0.8}>
          {/* Guitar body — rounded box */}
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[1.2, 1.4, 0.35, 32]} />
            <meshStandardMaterial
              color={bodyColor}
              metalness={0.6}
              roughness={0.25}
              emissive={bodyColor}
              emissiveIntensity={0.08}
            />
          </mesh>
          {/* Sound hole */}
          <mesh position={[0, -0.5, 0.18]}>
            <torusGeometry args={[0.35, 0.04, 16, 32]} />
            <meshStandardMaterial color="#0a0a15" metalness={0.3} roughness={0.5} />
          </mesh>
          {/* Neck */}
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[0.22, 3.0, 0.15]} />
            <meshStandardMaterial
              color="#8B6914"
              metalness={0.4}
              roughness={0.4}
            />
          </mesh>
          {/* Headstock */}
          <mesh position={[0, 3.2, 0]}>
            <boxGeometry args={[0.35, 0.6, 0.12]} />
            <meshStandardMaterial
              color={bodyColor}
              metalness={0.5}
              roughness={0.3}
              emissive={bodyColor}
              emissiveIntensity={0.05}
            />
          </mesh>
          {/* Strings */}
          {[-0.06, -0.02, 0.02, 0.06].map((xOff, i) => (
            <mesh key={i} position={[xOff, 1.0, 0.1]}>
              <cylinderGeometry args={[0.005, 0.005, 3.8, 6]} />
              <meshStandardMaterial
                color={stringColor}
                metalness={0.9}
                roughness={0.1}
                emissive={stringColor}
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
          {/* Bridge */}
          <mesh position={[0, -1.0, 0.18]}>
            <boxGeometry args={[0.5, 0.06, 0.06]} />
            <meshStandardMaterial color="#8B6914" metalness={0.5} roughness={0.3} />
          </mesh>
          {/* Tuning pegs */}
          {[-0.12, -0.04, 0.04, 0.12].map((xOff, i) => (
            <mesh key={`peg-${i}`} position={[xOff, 3.4, 0.1]}>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial
                color={stringColor}
                metalness={0.8}
                roughness={0.15}
              />
            </mesh>
          ))}
        </group>
      </Float>
    )
  }

  return (
    <Canvas
      camera={{ position: [0, 1, 6], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color={color} />
      <pointLight position={[-4, -2, -4]} intensity={0.6} color={accentColor} />
      <spotLight position={[0, 8, 4]} angle={0.3} intensity={0.8} penumbra={0.5} color="#ffffff" />
      <GuitarModel bodyColor={color} stringColor={accentColor} rotationSpeed={speed} />
      {!autoRotate && <OrbitControls enableZoom={false} enablePan={false} />}
    </Canvas>
  )
}

const Scene = dynamic(() => Promise.resolve(InstrumentRotateInner), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100%' }} />,
})

export default function InstrumentRotate({
  speed = 1,
  color = '#F5C518',
  accentColor = '#2560E8',
  autoRotate = true,
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
      className={`kc-3d-instrument ${className}`}
      style={{
        width: '100%',
        height: 400,
        ...style,
      }}
    >
      {visible && (
        <Scene speed={speed} color={color} accentColor={accentColor} autoRotate={autoRotate} />
      )}
    </div>
  )
}
