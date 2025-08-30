import { useTexture } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef, useMemo, useState } from 'react';
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
    inverted: boolean;
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
                inverted={review.inverted}
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

  return (
    <mesh
      ref={meshRef}
      rotation={[0, 0, 0]}
      position={[index * viewport.width, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[viewport.width, viewport.height]} />
      <meshStandardMaterial map={brickTexture} />
    </mesh>
  );
};

const Wall = () => {
  // Get viewport information to make wall cover entire view
  const { viewport, camera } = useThree();
  const scrollOffset = useRef(0);
  const reviewGroupRef = useRef<THREE.Group>(null);
  const wallGroupRef = useRef<THREE.Group>(null);

  // Mouse interaction state
  const [mouseNearLight, setMouseNearLight] = useState(false);
  const currentSpeed = useRef(0.15);

  // Page visibility state to pause animation when tab is inactive
  const [isPageVisible, setIsPageVisible] = useState(true);

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
      const lightAreaX = 0.29; // Right side of screen
      const lightAreaY = 0.4; // Upper area
      const lightRadius = 0.33;

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

  const target = useMemo(() => new THREE.Object3D(), []);

  // Real review data for Lewis Garnham's comedy career
  const reviews = useMemo(
    () => [
      {
        id: 1,
        title:
          '“A true artist. How can one man be so funny?” \n Theatre Travels, 2023',
        text: 'Lewis was nominated for "Best Emerging Artist" at Adelaide Fringe in 2017 and followed up with nominations for "Best Comedy" at Perth Fringe World and the prestigious "Best Newcomer Award" at the Melbourne International Comedy Festival in 2018.\n\nHe has since written and toured a new solo show every year, building a large, loyal audience.',
        starRating: 0,
        position: [0, 0.3, 0] as [number, number, number],
        inverted: false,
      },
      {
        id: 2,
        title: '“A rich source of edgy jokes” \n Chortle, 2023',
        text: 'His 2023 show, Lewis Garnham Hit A Pigeon With His Bike, sold out across six cities (including selling out his entire 22 night run at Melbourne Comedy Festival) and became his debut stand-up special.\n\nIt was produced by Recliner Films and released on Youtube where it clocked over 40,000 views in the first two months.',
        starRating: 4,
        position: [5, -0.2, 0] as [number, number, number],
        inverted: true,
      },
      {
        id: 3,
        title: 'The Scotsman, 2024',
        text: 'In 2024, Lewis performed at the Melbourne International Comedy Festival Oxfam Gala at The Palais Theatre - the biggest night in Australian comedy.\n\nHe also won a Moosehead Award for his show Choosing The Wrong Story To Tell, had a successful Edinburgh Fringe run with a four star review in The Scotsman and multiple sell out shows and released Choosing The Wrong Story To Tell as his second special. This time it was shot at the iconic venue, Max Watts, Melbourne.',
        starRating: 4,
        position: [10, 0.1, 0] as [number, number, number],
        inverted: false,
      },
      {
        id: 4,
        title: 'Artshub, 2025',
        text: "Lewis' self produced 2025 tour sold out its entire runs in Perth, Adelaide, Melbourne, Sydney, Brisbane and Byron Bay.\n\nAt the 2025 Melbourne International Comedy Festival, after his entire 22 night season sold out, Lewis added 10 extra shows in bigger venues, which also entirely sold out.",
        starRating: 4,
        position: [15, -0.1, 0] as [number, number, number],
        inverted: true,
      },
    ],
    []
  );

  // Load the brick texture using the correct path
  const brickTexture = useTexture(
    '/src/components/r3f/images/brick_texture.jpg'
  );

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

      // Make texture repeat multiple times for smooth scrolling, but zoom in more (smaller repeat = larger bricks)
      brickTexture.repeat.multiplyScalar(0.8);

      // Update the texture
      brickTexture.needsUpdate = true;
    }
  }, [brickTexture, viewport.width, viewport.height]);

  // Animation loop for scrolling
  useFrame((state: any, delta: number) => {
    // Don't update animation if page is not visible (prevents catch-up scrolling)
    if (!isPageVisible) return;

    // Smooth transitions for speed and zoom
    const targetSpeed = mouseNearLight ? 0.04 : 0.12; // Slow down when near light
    const targetZoom = mouseNearLight ? 1.1 : 1.0; // Slight zoom when near light

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
  });

  return (
    <group>
      <primitive object={target} position={[3, -1.2, 3]} />

      <spotLight
        position={[3.55, 20, 5]}
        target-position={[0, 0, 0]}
        angle={Math.PI / 15} // 45 degrees for better coverage
        penumbra={1}
        intensity={100}
        distance={50}
        target={target}
        decay={0.5}
      />

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
