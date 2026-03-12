'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Float, MeshDistortMaterial, Sphere, Torus, Icosahedron } from '@react-three/drei'
import * as THREE from 'three'

// Particle system component
function Particles({ count = 5000 }: { count?: number }) {
  const points = useRef<THREE.Points>(null!)
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 25
      positions[i3 + 1] = (Math.random() - 0.5) * 25
      positions[i3 + 2] = (Math.random() - 0.5) * 25

      // Beautiful gradient colors
      const color = new THREE.Color()
      color.setHSL(Math.random() * 0.2 + 0.6, 0.8, 0.6) // Purple to pink range
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }

    return [positions, colors]
  }, [count])

  useFrame((state, delta) => {
    if (points.current) {
      points.current.rotation.x -= delta * 0.05
      points.current.rotation.y -= delta * 0.08
    }
  })

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  )
}

// Floating geometric shapes
function FloatingShapes() {
  return (
    <>
      <Float speed={2} rotationIntensity={2} floatIntensity={2}>
        <Icosahedron args={[1, 0]} position={[-6, 2, -5]} scale={0.8}>
          <MeshDistortMaterial
            color="#a855f7"
            attach="material"
            distort={0.5}
            speed={2}
            wireframe
            transparent
            opacity={0.6}
          />
        </Icosahedron>
      </Float>

      <Float speed={1.5} rotationIntensity={1} floatIntensity={1.5}>
        <Torus args={[0.8, 0.3, 16, 32]} position={[5, -2, -4]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <MeshDistortMaterial
            color="#ec4899"
            attach="material"
            distort={0.4}
            speed={1.5}
            wireframe
            transparent
            opacity={0.5}
          />
        </Torus>
      </Float>

      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={2}>
        <Sphere args={[0.6, 32, 32]} position={[0, 3, -6]}>
          <MeshDistortMaterial
            color="#f97316"
            attach="material"
            distort={0.6}
            speed={2}
            transparent
            opacity={0.4}
          />
        </Sphere>
      </Float>

      <Float speed={1.8} rotationIntensity={2} floatIntensity={1.8}>
        <Icosahedron args={[0.7, 0]} position={[-4, -3, -5]} scale={1.2}>
          <MeshDistortMaterial
            color="#06b6d4"
            attach="material"
            distort={0.5}
            speed={1.8}
            wireframe
            transparent
            opacity={0.5}
          />
        </Icosahedron>
      </Float>

      <Float speed={2.2} rotationIntensity={1.2} floatIntensity={2.2}>
        <Torus args={[0.6, 0.25, 16, 32]} position={[6, 3, -5]} rotation={[Math.PI / 3, 0, Math.PI / 3]}>
          <MeshDistortMaterial
            color="#8b5cf6"
            attach="material"
            distort={0.45}
            speed={2.2}
            wireframe
            transparent
            opacity={0.55}
          />
        </Torus>
      </Float>
    </>
  )
}

// Ambient light component
function AmbientLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#a855f7" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ec4899" />
      <pointLight position={[0, 0, 10]} intensity={0.5} color="#f97316" />
    </>
  )
}

// Mouse interaction hook
function useMouseMovement() {
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return mouse
}

// Main background component
export default function Stunning3DBackground() {
  const mouse = useMouseMovement()

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <AmbientLighting />
        <Particles count={4000} />
        <FloatingShapes />
      </Canvas>
    </div>
  )
}
