import { Canvas } from "@react-three/fiber";
import { Center, Plane } from "@react-three/drei";

import Shirt from "./Shirt";
import CameraRig from "./CameraRig";

const CanvasModel = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, -0.5, 6], fov: 25 }} // Increase the z-axis to 6 or 6.5
 // Lower the y position
      gl={{ preserveDrawingBuffer: true }}
      className="w-full h-full transition-all ease-in"
    >
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[2.5, 8, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
      />
      
      {/* Add a ground plane to receive shadows */}
      <Plane
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -1, 0]} 
        args={[10, 10]} 
        receiveShadow
      >
        <shadowMaterial attach="material" opacity={0.3} />
      </Plane>

      <CameraRig>
        <Center>
          <Shirt />
        </Center>
      </CameraRig>
    </Canvas>
  );
};

export default CanvasModel;
