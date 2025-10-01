import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  OrthographicCamera,
  ContactShadows,
  Environment,
  PerspectiveCamera,
} from '@react-three/drei';
import Wall from './Wall';
import * as THREE from 'three';
import { useState, useEffect } from 'react';

interface SceneProps {
  reviews?: Array<{
    id: number;
    title: string;
    text: string;
    starRating: number;
  }>;
}

const Scene = ({ reviews }: SceneProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 576);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='review-canvas'>
      <Canvas dpr={[1, 2]} shadows={{ type: THREE.PCFSoftShadowMap }}>
        <PerspectiveCamera
          makeDefault
          position={isMobile ? [0, 2.65, 6.2] : [0, 0, 5]}
          fov={isMobile ? 90 : 60}
        />
        <Wall reviews={reviews} />
      </Canvas>
    </div>
  );
};

export default Scene;
