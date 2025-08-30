import { Text, useTexture } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

interface ReviewProps {
  title: string;
  text: string;
  starRating: number;
  position: [number, number, number];
  inverted?: boolean;
}

const Review = ({
  title,
  text,
  starRating,
  position,
  inverted = false,
}: ReviewProps) => {
  const frameRef = useRef<THREE.Group>(null);

  // Calculate frame size based on text content more accurately
  const titleFontSize = 0.2;
  const textFontSize = 0.15;
  const lineHeight = 1.3;

  // Estimate text heights more accurately
  const estimateTextHeight = (
    text: string,
    fontSize: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const avgCharsPerLine = Math.floor(maxWidth / (fontSize * 0.7)); // Rough estimate
    const lines = Math.ceil(text.length / avgCharsPerLine);
    return lines * fontSize * lineHeight;
  };

  const baseWidth = 2;
  const width = Math.min(baseWidth + (title.length + text.length) / 400, 4);
  const maxTextWidth = width - 0.2;

  // Calculate heights for each element - stars are now included in title
  const titleWithStars =
    starRating > 0 ? '★'.repeat(starRating) + '\n' + title : title;
  const titleHeight = estimateTextHeight(
    titleWithStars,
    titleFontSize,
    maxTextWidth,
    lineHeight
  );
  const textHeight = estimateTextHeight(
    text,
    textFontSize,
    maxTextWidth,
    lineHeight
  );

  // Add padding between elements
  const elementPadding = 0.2;
  const framePadding = 0.25;

  // Calculate total content height - only title (with stars) and text
  const contentHeight = titleHeight + textHeight + elementPadding;
  const height = Math.max(contentHeight + framePadding * 2, 2.0); // Minimum height of 2.0

  // Calculate evenly distributed positions - only two elements now
  const totalContentSpace = height - framePadding * 2;
  const availableSpace = totalContentSpace - (titleHeight + textHeight);
  const spacing = availableSpace / 2; // Divide spacing evenly between two elements

  // Position calculations from top to bottom
  const titleY = height / 2 - framePadding - titleHeight / 2 - 0.1;
  const textY = titleY - titleHeight / 2 - spacing - textHeight / 2;

  // Frame thickness
  const frameThickness = 0.125;
  const frameDepth = 0.2;

  // Load poster texture
  const posterTexture = useTexture(
    '/src/components/r3f/images/poster_texture.jpg'
  );

  // Colors based on inverted prop
  const backgroundColor = '#d6ceab';
  const frameColor = '#222811';
  const textColor = '#000000';

  // Generate consistent rotation based on review content (not random each render)
  const randomSeed = (title.length + text.length) * 0.618034; // Golden ratio for better distribution
  const rotationZ = (Math.sin(randomSeed) * Math.PI * 2) / 180; // Max 2 degrees in either direction

  return (
    <group ref={frameRef} position={position} rotation={[0, 0, rotationZ]}>
      {/* Frame background - white matting */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[width, height, frameDepth]} />
        <meshStandardMaterial color={backgroundColor} />
      </mesh>

      {/* Poster texture with padding and slight rotation */}
      <mesh position={[0, 0, frameDepth / 2 + 0.001]} receiveShadow>
        <boxGeometry args={[width - 0.1, height - 0.1, 0.001]} />
        <meshStandardMaterial map={posterTexture} />
      </mesh>
      {/* Frame border - top */}
      <mesh position={[0, height / 2 + frameThickness / 2, 0.01]} castShadow>
        <boxGeometry
          args={[width + frameThickness * 2, frameThickness, frameDepth]}
        />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      {/* Frame border - bottom */}
      <mesh position={[0, -height / 2 - frameThickness / 2, 0.01]} castShadow>
        <boxGeometry
          args={[width + frameThickness * 2, frameThickness, frameDepth]}
        />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      {/* Frame border - left */}
      <mesh position={[-width / 2 - frameThickness / 2, 0, 0.01]} castShadow>
        <boxGeometry args={[frameThickness, height, frameDepth]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      {/* Frame border - right */}
      <mesh position={[width / 2 + frameThickness / 2, 0, 0.01]} castShadow>
        <boxGeometry args={[frameThickness, height, frameDepth]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      <Text
        position={[0, titleY, frameDepth / 2 + 0.02]}
        fontSize={titleFontSize}
        color={textColor}
        anchorX='center'
        anchorY='middle'
        maxWidth={width - 0.3}
        textAlign='center'
        font='fonts/Lexend-Bold.ttf'
        fillOpacity={0.8}
        lineHeight={lineHeight}
      >
        {starRating > 0 ? '★'.repeat(starRating) + '\n' + title : title}
      </Text>

      {/* Review Text - positioned at calculated textY */}
      <Text
        position={[0, textY, frameDepth / 2 + 0.02]}
        fontSize={textFontSize}
        color={textColor}
        anchorX='center'
        anchorY='middle'
        maxWidth={width - 0.4}
        lineHeight={lineHeight}
        textAlign='center'
        font='fonts/Lexend-Light.ttf'
        fillOpacity={0.9}
      >
        {text}
      </Text>
    </group>
  );
};

export default Review;
