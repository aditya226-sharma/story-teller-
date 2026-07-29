export const galaxyVertexShader = `
  uniform float uTime;
  uniform float uProgress;
  attribute float aSize;
  attribute float aAngle;
  attribute float aRadius;
  varying vec3 vColor;
  varying float vOpacity;
  
  void main() {
    float angle = aAngle + uTime * 0.1;
    float radius = aRadius * (0.5 + uProgress * 0.5);
    vec3 pos = vec3(
      cos(angle) * radius,
      (sin(uTime * 0.2 + aAngle) * 0.3) * (1.0 - radius * 0.1),
      sin(angle) * radius
    );
    
    float dist = length(pos.xz);
    vColor = mix(
      vec3(0.424, 0.388, 1.0),
      vec3(0.0, 0.898, 1.0),
      dist * 0.5
    );
    vOpacity = smoothstep(0.0, 0.3, 1.0 - dist * 0.3) * uProgress;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z) * uProgress;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const galaxyFragmentShader = `
  varying vec3 vColor;
  varying float vOpacity;
  
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    
    float alpha = smoothstep(0.5, 0.0, dist) * vOpacity;
    vec3 glow = vColor * 1.5;
    vec3 finalColor = mix(vColor, glow, smoothstep(0.3, 0.0, dist));
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;
