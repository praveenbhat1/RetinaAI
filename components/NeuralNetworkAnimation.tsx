"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

export default function NeuralNetworkAnimation() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const options: ISourceOptions = {
        background: {
            color: { value: "transparent" },
        },
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: { enable: true, mode: "grab" },
            },
            modes: {
                grab: { distance: 200, links: { opacity: 0.8, color: "#2563EB" } },
            },
        },
        particles: {
            color: { value: ["#2563EB", "#14B8A6"] }, // Mix of Blue and Teal
            links: {
                color: "#94a3b8", // Slate 400
                distance: 130,
                enable: true,
                opacity: 0.3,
                width: 1,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: true,
                speed: 0.5, // Even slower, elegant drifting
                straight: false,
            },
            number: {
                density: { enable: true, width: 800, height: 800 },
                value: 100, // Slightly reduced density so it doesn't clutter
            },
            opacity: { value: 0.5, animation: { enable: true, speed: 1, sync: false } },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
    };

    if (!init) return null;

    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50" style={{
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
        }}>
            <Particles id="tsparticles" options={options} />
        </div>
    );
}
