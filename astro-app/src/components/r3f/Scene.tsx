import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  OrthographicCamera,
  ContactShadows,
  Environment,
} from '@react-three/drei';
import Wall from './Wall';
import * as THREE from 'three';

const Scene = () => {
  return (
    <div className='review-canvas'>
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 60,
        }}
        dpr={[1, 2]}
        shadows={{ type: THREE.PCFSoftShadowMap }}
      >
        {/* <OrthographicCamera makeDefault position={[1, 1, 1]} /> */}
        <ambientLight intensity={0.05} />

        <Wall />
      </Canvas>
    </div>
  );
};

export default Scene;
