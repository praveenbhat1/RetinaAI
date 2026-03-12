"use client";

import { useRef, useMemo } from "react";
import * as THREE from "three";

export default function RetinaShader() {
    const meshRef = useRef<THREE.Group>(null);

    const eyeballMaterial = useMemo(() => {
        const size = 1024;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            // Base Sclera (White medical look)
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, size, size);

            // Draw subtle branching reddish blood vessels from the poles and edges
            ctx.strokeStyle = "rgba(200, 50, 50, 0.4)";
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            const drawVein = (x: number, y: number, length: number, angle: number, depth: number) => {
                if (depth === 0) return;
                ctx.beginPath();
                ctx.moveTo(x, y);
                const newX = x + Math.cos(angle) * length;
                const newY = y + Math.sin(angle) * length;
                ctx.lineTo(newX, newY);
                ctx.stroke();

                ctx.lineWidth = Math.max(0.5, ctx.lineWidth * 0.7);
                const spread = 0.4 + Math.random() * 0.3;
                if (Math.random() > 0.1) drawVein(newX, newY, length * (0.6 + Math.random() * 0.3), angle + spread, depth - 1);
                if (Math.random() > 0.1) drawVein(newX, newY, length * (0.6 + Math.random() * 0.3), angle - spread, depth - 1);
            };

            // Generate veins around the sclera fading towards the center
            for (let i = 0; i < 60; i++) {
                ctx.lineWidth = 2 + Math.random() * 2;
                const edgeX = Math.random() < 0.5 ? 0 : size;
                const edgeY = Math.random() * size;
                const angle = edgeX === 0 ? (Math.random() * Math.PI - Math.PI / 2) : (Math.random() * Math.PI + Math.PI / 2);
                drawVein(edgeX, edgeY, 30 + Math.random() * 50, angle, 4);
            }

            // Iris positioning (center of canvas maps to equator)
            const centerX = size / 2;
            const centerY = size / 2;
            const irisRadius = size * 0.15;
            const pupilRadius = size * 0.05;

            // Iris gradient (Blue to Teal)
            const irisGrad = ctx.createRadialGradient(centerX, centerY, pupilRadius, centerX, centerY, irisRadius);
            irisGrad.addColorStop(0, "#011c2e"); // dark pupil rim
            irisGrad.addColorStop(0.2, "#2563EB"); // primary blue
            irisGrad.addColorStop(0.7, "#14B8A6"); // secondary teal
            irisGrad.addColorStop(1, "#022c22"); // dark iris edge

            // Draw Iris
            ctx.beginPath();
            ctx.arc(centerX, centerY, irisRadius, 0, Math.PI * 2);
            ctx.fillStyle = irisGrad;
            ctx.fill();

            // Draw Iris structural lines (stroma)
            for (let i = 0; i < 200; i++) {
                const angle = Math.random() * Math.PI * 2;
                const r1 = pupilRadius + Math.random() * (irisRadius - pupilRadius);
                const r2 = r1 + Math.random() * 20;
                ctx.beginPath();
                ctx.moveTo(centerX + Math.cos(angle) * r1, centerY + Math.sin(angle) * r1);
                ctx.lineTo(centerX + Math.cos(angle) * r2, centerY + Math.sin(angle) * r2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            // Draw Pupil (Black)
            ctx.beginPath();
            ctx.arc(centerX, centerY, pupilRadius, 0, Math.PI * 2);
            ctx.fillStyle = "#000000";
            ctx.fill();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        return new THREE.MeshStandardMaterial({
            map: texture,
            color: "#ffffff",
            roughness: 0.2,
            metalness: 0.1,
            bumpMap: texture,
            bumpScale: 0.005,
        });
    }, []);

    return (
        <group ref={meshRef} rotation={[0, -Math.PI / 2, 0]}>
            {/* Main Eyeball */}
            <mesh>
                <sphereGeometry args={[2.5, 64, 64]} />
                <primitive object={eyeballMaterial} attach="material" />
            </mesh>
            {/* Outer transparent cornea/gloss layer */}
            <mesh>
                <sphereGeometry args={[2.53, 64, 64]} />
                <meshPhysicalMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.15}
                    roughness={0}
                    metalness={0.1}
                    clearcoat={1.0}
                    clearcoatRoughness={0.1}
                />
            </mesh>
        </group>
    );
}
