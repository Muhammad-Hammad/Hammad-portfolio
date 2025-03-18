import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useMobile } from './useMobileHook';

export default function TronGridBackground() {
  const isMobile = useMobile();

  return (
    <div className="fixed inset-0 -z-10 bg-[#030318]">
      <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera
          makeDefault
          position={[0, 6, 12]}
          fov={isMobile ? 75 : 60}
        />
        <color attach="background" args={['#030318']} />
        <fog attach="fog" args={['#030318', 10, 50]} />
        <ambientLight intensity={0.1} />
        <TronGrid isMobile={isMobile} />
        <GridLines />
        <PulsingLight />
      </Canvas>
    </div>
  );
}

function TronGrid({ isMobile }) {
  const gridRef = useRef();
  const gridSize = isMobile ? 30 : 50;
  const gridDivisions = isMobile ? 30 : 50;

  useFrame(({ clock }) => {
    if (gridRef.current) {
      // Subtle breathing animation
      const t = clock.getElapsedTime() * 0.5;
      gridRef.current.material.opacity = THREE.MathUtils.lerp(
        0.3,
        0.5,
        Math.sin(t) * 0.5 + 0.5
      );
    }
  });

  return (
    <group>
      {/* Main horizontal grid */}
      <gridHelper
        ref={gridRef}
        args={[gridSize, gridDivisions, '#00a2ff', '#00a2ff']}
        position={[0, -0.1, 0]}
        rotation={[0, 0, 0]}
      >
        <meshBasicMaterial
          color="#00a2ff"
          transparent
          opacity={0.4}
          toneMapped={false}
        />
      </gridHelper>

      {/* Vertical grid lines */}
      <VerticalGridLines count={11} size={gridSize} />
    </group>
  );
}

function VerticalGridLines({ count, size }) {
  const lines = [];
  const halfSize = size / 2;
  const spacing = size / (count - 1);

  for (let i = 0; i < count; i++) {
    const x = -halfSize + i * spacing;
    lines.push(
      <line key={`line-x-${i}`}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([x, 0, -halfSize, x, 0, halfSize])}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          attach="material"
          color="#00a2ff"
          transparent
          opacity={0.4}
          toneMapped={false}
        />
      </line>
    );

    const z = -halfSize + i * spacing;
    lines.push(
      <line key={`line-z-${i}`}>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array([-halfSize, 0, z, halfSize, 0, z])}
            count={2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          attach="material"
          color="#00a2ff"
          transparent
          opacity={0.4}
          toneMapped={false}
        />
      </line>
    );
  }

  return <>{lines}</>;
}

function GridLines() {
  const linesRef = useRef();
  const { viewport } = useThree();
  const lineCount = 20;
  const linePositions = [];

  // Create horizontal lines that extend to infinity
  for (let i = 0; i < lineCount; i++) {
    const y = (i / lineCount) * 10;
    linePositions.push(-100, y, 0, 100, y, 0);
  }

  useFrame(({ clock }) => {
    if (linesRef.current) {
      // Move the lines towards the camera
      const positions = linesRef.current.geometry.attributes.position.array;
      const time = clock.getElapsedTime();

      for (let i = 0; i < positions.length; i += 6) {
        // Move z position of both points of the line
        positions[i + 2] = ((time * 5 + i) % 50) - 25;
        positions[i + 5] = ((time * 5 + i) % 50) - 25;
      }

      linesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(linePositions)}
          count={lineCount * 2}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#00ffff"
        transparent
        opacity={0.3}
        toneMapped={false}
      />
    </lineSegments>
  );
}

function PulsingLight() {
  const lightRef = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { viewport } = useThree();

  useEffect(() => {
    const handleMouseMove = event => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      // Convert normalized coordinates to world space
      const x = (mousePosition.x * viewport.width) / 2;
      const y = (mousePosition.y * viewport.height) / 4 + 2;

      // Smooth follow
      lightRef.current.position.x = THREE.MathUtils.lerp(
        lightRef.current.position.x,
        x,
        0.05
      );
      lightRef.current.position.y = THREE.MathUtils.lerp(
        lightRef.current.position.y,
        y,
        0.05
      );

      // Pulsing intensity
      const time = clock.getElapsedTime();
      lightRef.current.intensity = 2 + Math.sin(time * 2) * 0.5;
    }
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        position={[0, 5, 5]}
        intensity={2}
        distance={20}
        color="#00ffff"
        castShadow
      />
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#030318"
          metalness={0.8}
          roughness={0.5}
          emissive="#000620"
          emissiveIntensity={0.2}
        />
      </mesh>
    </>
  );
}
