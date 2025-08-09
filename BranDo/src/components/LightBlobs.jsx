import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { MathUtils } from 'three';

const LightBlobs = () => {
  const ref = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    ref.current.position.y = Math.sin(elapsedTime * 0.5) * 2;
    ref.current.position.x = Math.cos(elapsedTime * 0.5) * 2;
  });

  return (
    <>
      <Sphere ref={ref} args={[0.5, 32, 32]} position={[0, 1, 0]}>
        <meshBasicMaterial color="rgba(255, 255, 255, 0.5)" />
      </Sphere>
      {/* Add more spheres or adjust properties as needed */}
    </>
  );
};

export default LightBlobs;
