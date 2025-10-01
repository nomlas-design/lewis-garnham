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
  const [cameraPosition, setCameraPosition] = useState<
    [number, number, number]
  >([0, 0, 5]);
  const [fov, setFov] = useState(60);

  useEffect(() => {
    const calculateCameraPosition = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;
      const isMobileDevice = width < 576;

      setIsMobile(isMobileDevice);

      if (isMobileDevice) {
        // Calculate Y and Z based on viewport dimensions
        // Taller screens (smaller aspect ratio) need camera higher and further back
        // Galaxy S8: ~0.46, iPhone SE: ~0.46, iPhone 12: ~0.46, wider phones: ~0.5-0.6

        // Direct aspect ratio-based positioning for different phone widths
        const yPosition =
          aspectRatio < 0.48 ? 2.45 : aspectRatio > 0.6 ? 2.0 : 4.5;
        const zPosition =
          aspectRatio < 0.48 ? 7.5 : aspectRatio > 0.6 ? 6.0 : 8.0;
        const mobileFov = aspectRatio < 0.48 ? 75 : aspectRatio > 0.6 ? 90 : 85;

        setCameraPosition([0, yPosition, zPosition]);
        setFov(mobileFov);
      } else {
        // Desktop positioning
        setCameraPosition([0, 0, 5]);
        setFov(60);
      }
    };

    calculateCameraPosition();
    window.addEventListener('resize', calculateCameraPosition);
    return () => window.removeEventListener('resize', calculateCameraPosition);
  }, []);

  return (
    <div className='review-canvas'>
      <Canvas dpr={[1, 2]} shadows={{ type: THREE.PCFSoftShadowMap }}>
        <PerspectiveCamera makeDefault position={cameraPosition} fov={fov} />
        <Wall reviews={reviews} />
      </Canvas>
    </div>
  );
};

export default Scene;
