// vertex.js
export const vertex = /* glsl */ `
  // Uniforms passed from our React component
  uniform float uProgress;
  uniform float uRadius;
  uniform float uTotalLength;
  uniform float uPlaneBendStrength; // NEW: Controls the curve of the plane

  varying vec2 vUv;
  const float PI = 3.141592653589793;



  void main() {
    vUv = uv;

    // --- START OF NEW CODE ---
    // STEP 0: BEND THE LOCAL PLANE GEOMETRY
    // We create the curve by displacing the z-coordinate based on the x-coordinate.
    // A simple parabola (z = x^2) works great for this.
    vec3 localBentPosition = position;
    localBentPosition.z += pow(position.x, 2.0) * uPlaneBendStrength;
    // --- END OF NEW CODE ---


    // 1. GET THE WORLD POSITION (using our NEWLY BENT local position)
    vec4 worldPosition = modelMatrix * vec4(localBentPosition, 1.0);

    // 2. APPLY THE INFINITE SCROLL
    float scrolledY = worldPosition.y + uProgress;

    // 3. WRAP THE POSITION (SEAMLESS LOOP)
    float wrappedY = mod(scrolledY + uTotalLength / 2., uTotalLength) - uTotalLength / 2.;

    // 4. CONVERT Y-POSITION TO AN ANGLE
    float angle = wrappedY / uRadius;

    // 5. CALCULATE THE NEW XYZ POSITION ON THE CYLINDER
    vec3 bentPosition;
    bentPosition.x = worldPosition.x;
    bentPosition.y = uRadius * sin(angle);
    bentPosition.z = uRadius * cos(angle);

    // 6. OUTPUT THE FINAL POSITION
    gl_Position = projectionMatrix * viewMatrix * vec4(bentPosition, 1.0);
  }
`;

// fragment.js
export const fragment = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;

  void main() {
    // A simple color. You can get more creative here.
    vec3 finalColor = vec3(0.5, 0.2, 0.8);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
