varying vec2 vUv;
varying float vWave;
uniform float uTime;
uniform vec3 uColorStart;
uniform vec3 uColorEnd;

void main() {
  vec3 gradient = mix(uColorStart, uColorEnd, vUv.y + vWave);
  
  // Add some additional color variation based on time
  gradient += 0.05 * sin(uTime * 0.5 + vUv.x * 10.0);
  
  // Small sparkle effect
  float sparkle = max(0.0, sin(uTime * 2.0 + vUv.x * 30.0 + vUv.y * 50.0));
  sparkle = pow(sparkle, 20.0) * 0.1;
  
  gl_FragColor = vec4(gradient + sparkle, 1.0);
}