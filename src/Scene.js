import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, Text3D, Center, Float, MeshTransmissionMaterial, GradientTexture } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

function BrandMark(props) {
  const mesh = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.25;
      mesh.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }
  });

  return (
    <group {...props}>
      {/* Stylized "V" mark built from two beveled extrusions */}
      <mesh castShadow receiveShadow position={[0, 0.1, 0]} ref={mesh}>
        <torusKnotGeometry args={[0.58, 0.18, 128, 16, 2, 3]} />
        <meshStandardMaterial metalness={0.9} roughness={0.18} color={'#5b9dff'}>
          <GradientTexture
            stops={[0, 0.5, 1]}
            colors={['#5b9dff', '#7a5bff', '#00f5d4']}
            size={1024}
          />
        </meshStandardMaterial>
      </mesh>

      {/* Glassy shard intersect for tech vibe */}
      <mesh castShadow receiveShadow position={[0, 0.6, 0]} rotation={[0.2, 0.6, 0]}>
        <icosahedronGeometry args={[0.42, 1]} />
        <MeshTransmissionMaterial
          thickness={0.5}
          anisotropy={0.6}
          chromaticAberration={0.05}
          distortion={0.0}
          roughness={0.15}
          transmission={1}
          ior={1.45}
          color="#aaf6ff"
        />
      </mesh>
    </group>
  );
}

function Wordmark() {
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#e6f1ff', metalness: 0.6, roughness: 0.25 }),
    []
  );
  return (
    <Center top position={[0, -0.5, 0]}>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.25}>
        <Text3D
          font="https://unpkg.com/three@0.170.0/examples/fonts/helvetiker_bold.typeface.json"
          size={0.5}
          height={0.2}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.01}
          bevelSegments={8}
        >
          Virtechz
          <primitive object={material} attach="material" />
        </Text3D>
      </Float>
    </Center>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-4, 3, -2]} intensity={0.8} color={'#7a5bff'} />
      <pointLight position={[3, -2, 4]} intensity={0.7} color={'#00f5d4'} />
    </>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]} receiveShadow>
      <circleGeometry args={[6, 64]} />
      <meshStandardMaterial color={'#0d1321'} metalness={0.2} roughness={0.9} />
    </mesh>
  );
}

function Backdrop() {
  return (
    <mesh position={[0, 0, -3]}>
      <planeGeometry args={[20, 10]} />
      <meshBasicMaterial>
        <GradientTexture
          stops={[0, 1]}
          colors={['#0b1020', '#121b33']}
          size={1024}
        />
      </meshBasicMaterial>
    </mesh>
  );
}

export default function Scene({ canvasRef }) {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, preserveDrawingBuffer: true }}
      dpr={[1, 2]}
      camera={{ position: [2.8, 1.8, 4.2], fov: 45, near: 0.1, far: 100 }}
      onCreated={({ gl }) => {
        if (canvasRef) canvasRef.current = gl.domElement;
      }}
      style={{ width: '100%', height: '100%', borderRadius: 16 }}
    >
      <color attach="background" args={['#0b1020']} />
      <fog attach="fog" args={['#0b1020', 10, 18]} />
      <Backdrop />
      <Lights />
      <Environment preset="city" />
      <group position={[0, 0.2, 0]}>
        <BrandMark />
        <Wordmark />
      </group>
      <Ground />
      <OrbitControls
        enablePan={false}
        minDistance={2.5}
        maxDistance={8}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}

