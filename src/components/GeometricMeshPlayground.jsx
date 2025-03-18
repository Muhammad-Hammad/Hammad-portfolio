'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  PerspectiveCamera,
  Float,
  MeshDistortMaterial,
  MeshWobbleMaterial,
} from '@react-three/drei';
import * as THREE from 'three';
import { useMobile } from './useMobileHook';

export default function GeometricMeshPlayground() {
  const isMobile = useMobile();

  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
      <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera
          makeDefault
          position={[0, 0, 15]}
          fov={isMobile ? 75 : 20}
        />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <pointLight position={[-5, -5, -5]} intensity={0.2} />
        <Shapes isMobile={isMobile} />
        <MouseInteraction />
      </Canvas>
    </div>
  );
}

function Shapes({ isMobile }) {
  const count = isMobile ? 15 : 40;
  const shapes = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      // Distribute shapes in a sphere-like formation
      const radius = 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      // Randomize shape type, size, and rotation speed
      const shapeType = Math.floor(Math.random() * 5); // 0-4 for different shapes
      const size = Math.random() * 0.5 + 0.5;
      const rotationSpeed = {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      };

      // Generate a random hue for the initial color
      const hue = Math.random();
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);

      return {
        position: [x, y, z],
        shapeType,
        size,
        rotationSpeed,
        color: color.getHex(),
        hue,
      };
    });
  }, [count]);

  return (
    <group>
      {shapes.map((shape, i) => (
        <Shape
          key={i}
          position={shape.position}
          shapeType={shape.shapeType}
          size={shape.size}
          rotationSpeed={shape.rotationSpeed}
          initialColor={shape.color}
          initialHue={shape.hue}
        />
      ))}
    </group>
  );
}

function Shape({
  position,
  shapeType,
  size,
  rotationSpeed,
  initialColor,
  initialHue,
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Use a ref to store the current hue for color animation
  const hueRef = useRef(initialHue);

  // Determine which geometry to use based on shapeType
  const geometry = useMemo(() => {
    switch (shapeType) {
      case 0:
        return new THREE.TetrahedronGeometry(size, 0);
      case 1:
        return new THREE.BoxGeometry(size, size, size);
      case 2:
        return new THREE.SphereGeometry(size, 8, 8);
      case 3:
        return new THREE.OctahedronGeometry(size, 0);
      case 4:
        return new THREE.IcosahedronGeometry(size, 0);
      default:
        return new THREE.TetrahedronGeometry(size, 0);
    }
  }, [shapeType, size]);

  // Animation frame
  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Rotate the shape
      meshRef.current.rotation.x += rotationSpeed.x;
      meshRef.current.rotation.y += rotationSpeed.y;
      meshRef.current.rotation.z += rotationSpeed.z;

      // Animate color over time
      hueRef.current = (hueRef.current + 0.001) % 1;
      const color = new THREE.Color().setHSL(
        hueRef.current,
        0.8,
        hovered ? 0.7 : 0.6
      );

      if (meshRef.current.material) {
        meshRef.current.material.color = color;

        // If using distort material, animate the distortion
        if (clicked && meshRef.current.material.distort !== undefined) {
          meshRef.current.material.distort =
            0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
        }

        // If using wobble material, animate the wobble
        if (clicked && meshRef.current.material.factor !== undefined) {
          meshRef.current.material.factor =
            0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
        }
      }

      // Scale effect on hover
      if (hovered) {
        meshRef.current.scale.x = THREE.MathUtils.lerp(
          meshRef.current.scale.x,
          1.2,
          0.1
        );
        meshRef.current.scale.y = THREE.MathUtils.lerp(
          meshRef.current.scale.y,
          1.2,
          0.1
        );
        meshRef.current.scale.z = THREE.MathUtils.lerp(
          meshRef.current.scale.z,
          1.2,
          0.1
        );
      } else {
        meshRef.current.scale.x = THREE.MathUtils.lerp(
          meshRef.current.scale.x,
          1.0,
          0.1
        );
        meshRef.current.scale.y = THREE.MathUtils.lerp(
          meshRef.current.scale.y,
          1.0,
          0.1
        );
        meshRef.current.scale.z = THREE.MathUtils.lerp(
          meshRef.current.scale.z,
          1.0,
          0.1
        );
      }
    }
  });

  // Determine which material to use based on clicked state
  const material = useMemo(() => {
    if (clicked) {
      // Use a distort material for clicked shapes
      return (
        <MeshDistortMaterial
          color={new THREE.Color(initialColor)}
          speed={2}
          distort={0.3}
          metalness={0.5}
          roughness={0.2}
        />
      );
    } else {
      // Use a wobble material for non-clicked shapes
      return (
        <MeshWobbleMaterial
          color={new THREE.Color(initialColor)}
          factor={0.4}
          speed={2}
          metalness={0.3}
          roughness={0.4}
        />
      );
    }
  }, [clicked, initialColor]);

  return (
    <Float
      speed={2}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      position={position}
    >
      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
      >
        {material}
      </mesh>
    </Float>
  );
}

function MouseInteraction() {
  const { camera, mouse, viewport } = useThree();
  const [isClicking, setIsClicking] = useState(false);
  const [clickPosition, setClickPosition] = useState([0, 0, 0]);
  const lightRef = useRef();

  // Handle mouse down/up events
  useEffect(() => {
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Update light position based on mouse position
  useFrame(() => {
    if (lightRef.current) {
      // Convert mouse coordinates to 3D space
      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));

      // Smooth follow
      lightRef.current.position.x = THREE.MathUtils.lerp(
        lightRef.current.position.x,
        pos.x,
        0.1
      );
      lightRef.current.position.y = THREE.MathUtils.lerp(
        lightRef.current.position.y,
        pos.y,
        0.1
      );

      // Change light color based on position
      const hue = (pos.x / viewport.width + 0.5) % 1;
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      lightRef.current.color = color;
    }
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 5]}
      intensity={2}
      distance={15}
      color="#ffffff"
    />
  );
}
