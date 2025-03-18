import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useMobile } from './useMobileHook';

export default function EnhancedTronGrid() {
  const isMobile = useMobile();

  return (
    <div className="fixed inset-0 -z-10 bg-[#030318]">
      <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera
          makeDefault
          position={[0, 8, 16]}
          fov={isMobile ? 75 : 60}
        />
        <color attach="background" args={['#030318']} />
        <fog attach="fog" args={['#030318', 15, 50]} />
        <ambientLight intensity={0.1} />
        <MainGrid isMobile={isMobile} />
        <MovingLightTrails isMobile={isMobile} />
        <InteractiveHoverEffect />
        <PulseWave />
      </Canvas>
    </div>
  );
}

function MainGrid({ isMobile }) {
  const gridRef = useRef();
  const gridSize = isMobile ? 40 : 60;
  const gridDivisions = isMobile ? 40 : 200;

  // Create a custom shader material for the grid
  const gridMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#00a2ff') },
        uIntensity: { value: 1.0 },
      },
      vertexShader: `
        varying vec3 vPosition;
        
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uIntensity;
        varying vec3 vPosition;
        
        void main() {
          // Calculate distance from center
          float dist = length(vPosition.xz);
          
          // Pulse effect
          float pulse = sin(uTime * 0.5) * 0.5 + 0.5;
          
          // Grid lines effect
          float lineWidth = 0.02;
          float gridX = abs(fract(vPosition.x + 0.5) - 0.5);
          float gridZ = abs(fract(vPosition.z + 0.5) - 0.5);
          
          float grid = min(gridX, gridZ);
          float mask = smoothstep(lineWidth, 0.0, grid);
          
          // Fade out with distance
          float fade = smoothstep(30.0, 10.0, dist);
          
          // Combine effects
          float alpha = mask * fade * (0.3 + pulse * 0.2) * uIntensity;
          
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    gridMaterial.uniforms.uTime.value = t;
  });

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <planeGeometry
          args={[gridSize, gridSize, gridDivisions, gridDivisions]}
        />
        <primitive object={gridMaterial} attach="material" />
      </mesh>
    </group>
  );
}

function MovingLightTrails({ isMobile }) {
  const trailsRef = useRef();
  const trailCount = isMobile ? 50 : 300;
  const trailPositions = useMemo(() => {
    const positions = new Float32Array(trailCount * 6);

    for (let i = 0; i < trailCount; i++) {
      const i6 = i * 6;
      const x = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 60;

      positions[i6] = x;
      positions[i6 + 1] = 0.1;
      positions[i6 + 2] = z;

      positions[i6 + 3] = x;
      positions[i6 + 4] = 0.1;
      positions[i6 + 5] = z + 2;
    }

    return positions;
  }, [trailCount]);

  const trailColors = useMemo(() => {
    const colors = new Float32Array(trailCount * 6);

    for (let i = 0; i < trailCount; i++) {
      const i6 = i * 6;
      const hue = Math.random() * 0.1 + 0.55; // Blue to cyan range
      const color = new THREE.Color().setHSL(hue, 1, 0.5);

      colors[i6] = color.r;
      colors[i6 + 1] = color.g;
      colors[i6 + 2] = color.b;

      colors[i6 + 3] = color.r;
      colors[i6 + 4] = color.g;
      colors[i6 + 5] = color.b;
    }

    return colors;
  }, [trailCount]);

  useFrame(({ clock }) => {
    if (trailsRef.current) {
      const positions = trailsRef.current.geometry.attributes.position.array;
      const time = clock.getElapsedTime();

      for (let i = 0; i < trailCount; i++) {
        const i6 = i * 6;
        const speed = ((i % 5) + 1) * 3;

        // Move the trail along z-axis
        positions[i6 + 2] = ((time * speed + i) % 60) - 30;
        positions[i6 + 5] = positions[i6 + 2] + 2;
      }

      trailsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={trailsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={trailPositions}
          count={trailCount * 200}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={trailColors}
          count={trailCount * 200}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors
        transparent
        opacity={0.8}
        toneMapped={false}
        linewidth={1}
      />
    </lineSegments>
  );
}

function InteractiveHoverEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { viewport, camera } = useThree();
  const lightRef = useRef();
  const planeRef = useRef();

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

  useFrame(() => {
    if (lightRef.current && planeRef.current) {
      // Create a raycaster
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mousePosition, camera);

      // Find intersection with the plane
      const intersects = raycaster.intersectObject(planeRef.current);

      if (intersects.length > 0) {
        const point = intersects[0].point;

        // Move the light to the intersection point
        lightRef.current.position.x = point.x;
        lightRef.current.position.z = point.z;
      }
    }
  });

  return (
    <>
      <pointLight
        ref={lightRef}
        position={[0, 0.5, 0]}
        intensity={2}
        distance={10}
        color="#00ffff"
      />

      {/* Invisible plane for raycasting */}
      <mesh
        ref={planeRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial />
      </mesh>
    </>
  );
}

function PulseWave() {
  const waveRef = useRef();
  const [pulses, setPulses] = useState([]);
  const { viewport } = useThree();

  useEffect(() => {
    const handleClick = event => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Create a raycaster to find the click position in 3D space
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x, y }, viewport.camera);

      // Find intersection with the ground plane
      const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const target = new THREE.Vector3();
      raycaster.ray.intersectPlane(groundPlane, target);

      setPulses(prev => [
        ...prev,
        {
          position: [target.x, 0.1, target.z],
          time: Date.now(),
          scale: 0.1,
          opacity: 1,
        },
      ]);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [viewport]);

  useFrame(() => {
    // Update pulses
    setPulses(
      prev =>
        prev
          .map(pulse => {
            const age = (Date.now() - pulse.time) / 1000;
            return {
              ...pulse,
              scale: age * 10, // Grow over time
              opacity: Math.max(0, 1 - age / 2), // Fade out
            };
          })
          .filter(pulse => pulse.opacity > 0) // Remove invisible pulses
    );
  });

  return (
    <>
      {pulses.map((pulse, i) => (
        <mesh
          key={pulse.time}
          position={pulse.position}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[pulse.scale, pulse.scale + 0.1, 32]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={pulse.opacity}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}
