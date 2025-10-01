import { useTexture } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useMemo, useState } from 'react';
import { animate } from 'popmotion';
import { RepeatWrapping } from 'three';
import * as THREE from 'three';
import Review from './Review';

interface WallElementProps {
  index: number;
  brickTexture: THREE.Texture;
  viewport: { width: number; height: number };
  scrollOffset: React.MutableRefObject<number>;
}

interface ReviewGroupProps {
  reviews: Array<{
    id: number;
    title: string;
    text: string;
    starRating: number;
    position: [number, number, number];
  }>;
  scrollOffset: React.MutableRefObject<number>;
}

const ReviewGroup: React.FC<ReviewGroupProps> = ({ reviews, scrollOffset }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const movement = scrollOffset.current * 5;
      const cycleLength = 20; // Adjust for 4 reviews spanning 0-15 with buffer
      groupRef.current.position.x = -(movement % cycleLength);
    }
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((setIndex) => (
        <group key={setIndex} position={[setIndex * 20, 0, 0]}>
          {reviews.map((review) => {
            return (
              <Review
                key={`${setIndex}-${review.id}`}
                title={review.title}
                text={review.text}
                starRating={review.starRating}
                position={review.position}
              />
            );
          })}
        </group>
      ))}
    </group>
  );
};

const WallElement: React.FC<WallElementProps> = ({
  index,
  brickTexture,
  viewport,
  scrollOffset,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      // Calculate the total width needed to cover the viewport with overlapping
      const totalWidth = viewport.width * 4;

      // Calculate the current scroll position
      const scrollPosition = scrollOffset.current * 5;

      // Base position for this wall element
      const basePosition = index * viewport.width;

      // Current position relative to scroll
      let currentPosition = basePosition - scrollPosition;

      // Use modulo for smooth cycling without jarring resets
      currentPosition =
        ((currentPosition % totalWidth) + totalWidth) % totalWidth;

      // Offset to ensure coverage (start elements off-screen to the right)
      if (currentPosition > viewport.width * 2) {
        currentPosition -= totalWidth;
      }

      meshRef.current.position.x = currentPosition;
    }
  });

  // Extend wall height for mobile to cover increased canvas
  const wallHeight = viewport.height * 1.5;

  // Adjust wall Y position based on aspect ratio for skinny phones
  const aspectRatio = typeof window !== 'undefined' ? window.innerWidth / window.innerHeight : 1;
  const wallYPosition = aspectRatio < 0.48 ? viewport.height * 0.35 : viewport.height * 0.25;

  return (
    <mesh
      ref={meshRef}
      rotation={[0, 0, 0]}
      position={[index * viewport.width, wallYPosition, 0]}
      receiveShadow
    >
      <planeGeometry args={[viewport.width, wallHeight]} />
      <meshStandardMaterial map={brickTexture} />
    </mesh>
  );
};

interface WallProps {
  reviews?: Array<{
    id: number;
    title: string;
    text: string;
    starRating: number;
  }>;
}

const Wall = ({ reviews: reviewsProp }: WallProps) => {
  // Get viewport information to make wall cover entire view
  const { viewport, camera } = useThree();
  const scrollOffset = useRef(0);
  const wallGroupRef = useRef<THREE.Group>(null);
  const lightRigRef = useRef<THREE.Group>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const lightAnimationRef = useRef<ReturnType<typeof animate> | null>(null);

  // Mouse interaction state
  const [mouseNearLight, setMouseNearLight] = useState(false);
  const currentSpeed = useRef(0.15);

  // Responsive breakpoints
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Page visibility state to pause animation when tab is inactive
  const [isPageVisible, setIsPageVisible] = useState(true);

  // Track screen size for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 576);
      setIsTablet(width >= 576 && width < 992);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track page visibility to prevent catch-up scrolling
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Track mouse position on the HTML layer
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Get mouse position relative to window
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Define light area in screen coordinates (upper right area)
      const lightAreaX = 0.5; // Right side of screen
      const lightAreaY = 0.25; // Upper area
      const lightRadius = 0.5;

      // Calculate distance to light area
      const distance = Math.sqrt(
        Math.pow(x - lightAreaX, 2) + Math.pow(y - lightAreaY, 2)
      );

      const isNear = distance < lightRadius;
      if (isNear !== mouseNearLight) {
        setMouseNearLight(isNear);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseNearLight]);

  // Responsive light target position
  const lightTarget = useMemo(() => {
    const obj = new THREE.Object3D();
    if (isMobile) {
      // Adjust target Y based on aspect ratio for skinny phones
      const aspectRatio = window.innerWidth / window.innerHeight;
      const targetY = aspectRatio < 0.48 ? -6 : -8; // Higher target for skinny devices
      obj.position.set(0, targetY, -2);
    } else if (isTablet) {
      obj.position.set(0, -21.2, -2); // Slightly left for tablet
    } else {
      obj.position.set(0.5, -21.2, -2); // Default desktop
    }
    return obj;
  }, [isMobile, isTablet]);

  // Real review data for Lewis Garnham's comedy career (fallback if no prop provided)
  const defaultReviews = useMemo(
    () => [
      {
        id: 1,
        title:
          '"A true artist. How can one man be so funny?" \n Theatre Travels, 2023',
        text: 'Lewis was nominated for "Best Emerging Artist" at Adelaide Fringe in 2017 and followed up with nominations for "Best Comedy" at Perth Fringe World and the prestigious "Best Newcomer Award" at the Melbourne International Comedy Festival in 2018.\n\nHe has since written and toured a new solo show every year, building a large, loyal audience.',
        starRating: 0,
        position: [0, 0.3, 0] as [number, number, number],
      },
      {
        id: 2,
        title: '"A rich source of edgy jokes" \n Chortle, 2023',
        text: 'His 2023 show, Lewis Garnham Hit A Pigeon With His Bike, sold out across six cities (including selling out his entire 22 night run at Melbourne Comedy Festival) and became his debut stand-up special.\n\nIt was produced by Recliner Films and released on Youtube where it clocked over 40,000 views in the first two months.',
        starRating: 4,
        position: [5, -0.2, 0] as [number, number, number],
      },
      {
        id: 3,
        title: 'The Scotsman, 2024',
        text: 'In 2024, Lewis performed at the Melbourne International Comedy Festival Oxfam Gala at The Palais Theatre - the biggest night in Australian comedy.\n\nHe also won a Moosehead Award for his show Choosing The Wrong Story To Tell, had a successful Edinburgh Fringe run with a four star review in The Scotsman and multiple sell out shows and released Choosing The Wrong Story To Tell as his second special. This time it was shot at the iconic venue, Max Watts, Melbourne.',
        starRating: 4,
        position: [10, 0.1, 0] as [number, number, number],
      },
      {
        id: 4,
        title: 'Artshub, 2025',
        text: "Lewis' self produced 2025 tour sold out its entire runs in Perth, Adelaide, Melbourne, Sydney, Brisbane and Byron Bay.\n\nAt the 2025 Melbourne International Comedy Festival, after his entire 22 night season sold out, Lewis added 10 extra shows in bigger venues, which also entirely sold out.",
        starRating: 4,
        position: [15, -0.1, 0] as [number, number, number],
      },
    ],
    []
  );

  // Add positions to reviews from prop or use default reviews
  const reviews = useMemo(() => {
    if (reviewsProp && reviewsProp.length > 0) {
      const positions: [number, number, number][] = [
        [0, 0.3, 0],
        [5, -0.2, 0],
        [10, 0.1, 0],
        [15, -0.1, 0],
      ];
      return reviewsProp.map((review, index) => ({
        ...review,
        position: positions[index % positions.length],
      }));
    }
    return defaultReviews;
  }, [reviewsProp, defaultReviews]);

  // Load the brick texture using the correct path
  const brickTexture = useTexture('/images/brick_texture.jpg');

  useEffect(() => {
    // Set texture to repeat for infinite scrolling
    brickTexture.wrapS = RepeatWrapping;
    brickTexture.wrapT = RepeatWrapping;

    if (brickTexture.image) {
      // Get the texture's natural aspect ratio
      const textureAspect =
        brickTexture.image.width / brickTexture.image.height;
      // Get the viewport's aspect ratio
      const viewportAspect = viewport.width / viewport.height;

      // Calculate scale factors for object-fit: cover behavior
      if (textureAspect > viewportAspect) {
        // Texture is wider than viewport - fit by height and crop sides
        const scale = viewportAspect / textureAspect;
        brickTexture.repeat.set(scale, 1);
        // Offset to move seam away from light area (shift left)
        brickTexture.offset.set((1 - scale) / 2 - 0.3, 0);
      } else {
        // Texture is taller than viewport - fit by width and crop top/bottom
        const scale = textureAspect / viewportAspect;
        brickTexture.repeat.set(1, scale);
        // Offset to move seam away from light area (shift left and down)
        brickTexture.offset.set(-0.3, (1 - scale) / 2 - 0.2);
      }

      // Make texture repeat multiple times for smooth scrolling
      // On mobile, make bricks much smaller (higher repeat value = smaller bricks)
      const textureScale = isMobile ? 2.5 : 0.8;
      brickTexture.repeat.multiplyScalar(textureScale);

      // Update the texture
      brickTexture.needsUpdate = true;
    }
  }, [brickTexture, viewport.width, viewport.height, isMobile]);

  useEffect(() => {
    if (!lightRigRef.current || !spotLightRef.current) return;

    const rig = lightRigRef.current;
    const light = spotLightRef.current;

    // Different initial angles for mobile vs desktop
    const initialZ = isMobile
      ? THREE.MathUtils.degToRad(30)
      : THREE.MathUtils.degToRad(34);
    const finalZ = isMobile ? THREE.MathUtils.degToRad(10) : 0;

    rig.rotation.set(0, 0, initialZ);
    light.target.updateMatrixWorld();

    const timeoutId = window.setTimeout(() => {
      const animation = animate({
        from: initialZ,
        to: finalZ,
        type: 'spring',
        stiffness: 9.5,
        damping: 1.75,
        mass: 1.2,
        restSpeed: 0.0025,
        restDelta: 0.00005,
        onUpdate: (value) => {
          if (!lightRigRef.current) return;
          rig.rotation.z = value;
          light.target.updateMatrixWorld();
        },
      });

      lightAnimationRef.current = animation;
    }, 2500);

    return () => {
      window.clearTimeout(timeoutId);
      lightAnimationRef.current?.stop();
      lightAnimationRef.current = null;
      rig.rotation.set(0, 0, finalZ);
      light.target.updateMatrixWorld();
    };
  }, [isMobile]);

  useFrame((state: any, delta: number) => {
    // Don't update animation if page is not visible (prevents catch-up scrolling)
    if (!isPageVisible) return;

    // Smooth transitions for speed and zoom
    let targetSpeed = 0.12;
    let targetZoom = 1.0;
    if (!isMobile) {
      targetSpeed = mouseNearLight ? 0.04 : 0.12; // Slow down when near light
      targetZoom = mouseNearLight ? 1.1 : 1.0; // Slight zoom when near light
    }

    // Lerp for smooth transitions
    currentSpeed.current = THREE.MathUtils.lerp(
      currentSpeed.current,
      targetSpeed,
      delta * 3
    );

    // Apply camera zoom
    camera.zoom = THREE.MathUtils.lerp(camera.zoom, targetZoom, delta * 2);
    camera.updateProjectionMatrix();

    scrollOffset.current += delta * currentSpeed.current;

    if (spotLightRef.current) {
      spotLightRef.current.target.updateMatrixWorld();
    }
  });

  const lightPosition: [number, number, number] = useMemo(() => {
    if (isMobile) {
      return [3, 10, 8];
    } else if (isTablet) {
      return [2.5, 20, 5]; // Slightly left on tablet
    } else {
      return [3.55, 20, 5]; // Default desktop
    }
  }, [isMobile, isTablet]);

  // Responsive ambient light intensity
  const ambientIntensity = isMobile ? 0.08 : 0.05;

  return (
    <group>
      <ambientLight intensity={ambientIntensity} />
      <group ref={lightRigRef} position={lightPosition}>
        <spotLight
          ref={spotLightRef}
          position={[0, 0, 0]}
          angle={isMobile ? Math.PI / 4 : Math.PI / 15}
          penumbra={isMobile ? 0.5 : 1}
          intensity={isMobile ? 500 : 100}
          distance={isMobile ? 100 : 50}
          target={lightTarget}
          decay={isMobile ? 1.5 : 0.5}
          castShadow={false}
        />
        <primitive object={lightTarget} />
      </group>

      {/* Wall group that moves as one unit */}
      <group ref={wallGroupRef}>
        {/* Create overlapping wall elements for smooth infinite scrolling */}
        {Array.from({ length: 4 }, (_, index) => (
          <WallElement
            key={index}
            index={index}
            brickTexture={brickTexture}
            viewport={viewport}
            scrollOffset={scrollOffset}
          />
        ))}

        {/* Reviews move synchronized with wall */}
        <ReviewGroup reviews={reviews} scrollOffset={scrollOffset} />
      </group>
    </group>
  );
};

export default Wall;
