import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const GlowingGrid = ({
  size = 50,
  divisions = 200,
  cellSize = 1,
  color = '#0ea5e9',
}) => {
  const gridRef = useRef();
  const materialRef = useRef();

  // Create grid geometry
  const geometry = useMemo(() => {
    const gridGeometry = new THREE.BufferGeometry();
    const vertices = [];

    // Create horizontal lines
    for (let i = 0; i <= divisions; i++) {
      const y = i * cellSize - size / 2;
      vertices.push(-size / 2, y, 0);
      vertices.push(size / 2, y, 0);
    }

    // Create vertical lines
    for (let i = 0; i <= divisions; i++) {
      const x = i * cellSize - size / 2;
      vertices.push(x, -size / 2, 0);
      vertices.push(x, size / 2, 0);
    }

    gridGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    return gridGeometry;
  }, [size, divisions, cellSize]);

  // Create pulsing and glowing material
  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.6,
      linewidth: 1,
    });
  }, [color]);

  // Animation for grid
  useFrame(state => {
    if (gridRef.current) {
      // Pulse effect
      const t = state.clock.getElapsedTime();

      // Subtle rotation
      gridRef.current.rotation.x = Math.sin(t * 0.05) * 0.05;
      gridRef.current.rotation.y = Math.sin(t * 0.03) * 0.05;

      // Pulse opacity
      if (materialRef.current) {
        materialRef.current.opacity = 0.3 + Math.sin(t * 0.5) * 0.2;
      }

      // Update grid position slightly with time
      gridRef.current.position.z = Math.sin(t * 0.2) * 0.5;
    }
  });

  return (
    <group>
      {/* Main grid */}
      <lineSegments ref={gridRef} geometry={geometry}>
        <primitive object={material} ref={materialRef} attach="material" />
      </lineSegments>

      {/* Glowing overlay grid - slightly offset and larger */}
      <lineSegments
        position={[0, 0, -0.1]}
        scale={1.002}
        rotation={[0.01, 0.01, 0]}
        geometry={geometry}
      >
        <lineBasicMaterial
          color="#7e69ab"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Background plane for additional glow effect */}
      <mesh position={[0, 0, -1]} rotation={[0, 0, 0]}>
        <planeGeometry args={[size * 1.5, size * 1.5]} />
        <meshBasicMaterial color="#030d2b" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

export { GlowingGrid };
