"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

function NeuralCore() {
    const outerRef = useRef<THREE.Mesh>(null);
    const innerRef = useRef<THREE.Mesh>(null);

    const particlesCount = 300;
    const positions = useMemo(() => {
        const pos = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const radius = 2.8 + Math.random() * 0.2;
            pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = radius * Math.cos(phi);
        }
        return pos;
    }, []);

    const pointsRef = useRef<THREE.Points>(null);

    useFrame((state, delta) => {
        if (outerRef.current) {
            outerRef.current.rotation.y += delta * 0.1;
            outerRef.current.rotation.z += delta * 0.05;
        }
        if (innerRef.current) {
            innerRef.current.rotation.y -= delta * 0.15;
            innerRef.current.rotation.x += delta * 0.08;

            // Gentle pulsing of the inner core
            const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.2 + 0.8;
            innerRef.current.scale.set(pulse, pulse, pulse);
        }
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.05;
        }
    });

    return (
        <group scale={[0.75, 0.75, 0.75]}>
            {/* Outer Wireframe Sphere */}
            <mesh ref={outerRef}>
                <sphereGeometry args={[2.6, 32, 32]} />
                <meshStandardMaterial
                    color="#94a3b8" // slate-400
                    emissive="#1e293b" // slate-800
                    emissiveIntensity={0.1}
                    wireframe={true}
                    transparent={true}
                    opacity={0.3}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Inner Glowing Core */}
            <mesh ref={innerRef}>
                <icosahedronGeometry args={[1.5, 2]} />
                <meshStandardMaterial
                    color="#ffffff"
                    emissive="#cbd5e1" // slate-300
                    emissiveIntensity={0.5}
                    roughness={0.2}
                    metalness={0.8}
                    wireframe={true}
                />
            </mesh>

            {/* Orbiting Neural Nodes */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[positions, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial size={0.06} color="#94a3b8" transparent opacity={0.4} sizeAttenuation />
            </points>
        </group>
    );
}

export default function Retina3D() {
    return (
        <div className="w-full h-full relative z-20 pointer-events-auto rounded-[3rem] overflow-hidden bg-slate-50/50 border border-slate-100/50">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
                <ambientLight intensity={1.2} color="#ffffff" />
                <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
                <pointLight position={[-10, 0, -5]} intensity={1.5} color="#cbd5e1" distance={10} />
                <pointLight position={[0, 0, 0]} intensity={2.5} color="#f1f5f9" distance={5} />

                <Float
                    speed={2}
                    rotationIntensity={0.2}
                    floatIntensity={1.5}
                    floatingRange={[-0.2, 0.2]}
                >
                    <NeuralCore />
                </Float>
            </Canvas>
        </div>
    );
}
