export const nebulaVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vec3 pos = position;
    pos += sin(uTime * 0.3 + position.x * 2.0) * 0.1;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

export const nebulaFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uOpacity;
  varying vec2 vUv;
  varying vec3 vPosition;
  
  float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }
  
  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
  
  void main() {
    vec2 uv = vUv;
    float n = fbm(uv * 3.0 + uTime * 0.1);
    float n2 = fbm(uv * 5.0 - uTime * 0.15);
    
    vec3 color = mix(uColor1, uColor2, n);
    color += vec3(n2 * 0.2);
    
    float alpha = smoothstep(0.2, 0.8, n) * uOpacity;
    gl_FragColor = vec4(color, alpha);
  }
`;
