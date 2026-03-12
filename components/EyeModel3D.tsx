"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import RetinaShader from "./RetinaShader";

function AnimatedContainer() {
    const groupRef = useRef<THREE.Group>(null);
    const { mouse } = useThree();

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Gentle slow base rotation mimicking natural eye wandering
            groupRef.current.rotation.y += delta * 0.15;

            // Subtle mouse tracking interactivity
            const targetRotationX = -(mouse.y * Math.PI) / 12;
            const targetRotationY = (mouse.x * Math.PI) / 8;

            groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
            groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            <RetinaShader />
        </group>
    );
}

export default function EyeModel3D() {
    return (
        <div className="w-full h-full relative z-20 pointer-events-auto">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />

                {/* Soft Medical Lighting */}
                <ambientLight intensity={1.5} color="#ffffff" />
                <directionalLight position={[5, 10, 8]} intensity={2} color="#ffffff" />
                <directionalLight position={[-5, 5, 2]} intensity={1} color="#f8fafc" />

                {/* Subtle glow rim lights */}
                <pointLight position={[-10, 0, -10]} intensity={1.5} color="#2563eb" />
                <pointLight position={[10, -5, -5]} intensity={1} color="#14b8a6" />

                <Suspense fallback={null}>
                    <Float
                        speed={2}
                        rotationIntensity={0.2}
                        floatIntensity={1.5}
                        floatingRange={[-0.15, 0.15]}
                    >
                        <AnimatedContainer />
                    </Float>
                </Suspense>
            </Canvas>
        </div>
    );
}
