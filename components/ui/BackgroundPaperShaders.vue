<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'

const props = withDefaults(defineProps<{
  color1?: string
  color2?: string
  ringRadius?: number
  ringColor?: string
  showRing?: boolean
}>(), {
  color1: '#ff5722',
  color2: '#ffffff',
  ringRadius: 1,
  ringColor: '#ff5722',
  showRing: true,
})

const canvasRef = ref<HTMLCanvasElement>()

let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let raf: number
let startTime: number

// Shader meshes
let shaderMesh: THREE.Mesh
let ringMesh: THREE.Mesh

// Custom vertex shader for wave distortion
const vertexShader = `
  uniform float time;
  uniform float intensity;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;

    vec3 pos = position;
    pos.y += sin(pos.x * 10.0 + time) * 0.1 * intensity;
    pos.x += cos(pos.y * 8.0 + time * 1.5) * 0.05 * intensity;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// Custom fragment shader for animated gradient noise
const fragmentShader = `
  uniform float time;
  uniform float intensity;
  uniform vec3 color1;
  uniform vec3 color2;
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vec2 uv = vUv;

    // Create animated noise pattern
    float noise = sin(uv.x * 20.0 + time) * cos(uv.y * 15.0 + time * 0.8);
    noise += sin(uv.x * 35.0 - time * 2.0) * cos(uv.y * 25.0 + time * 1.2) * 0.5;

    // Mix colors based on noise and position
    vec3 color = mix(color1, color2, noise * 0.5 + 0.5);
    color = mix(color, vec3(1.0), pow(abs(noise), 2.0) * intensity);

    // Soft vignette — wide falloff so it covers the full plane
    float dist = length(uv - 0.5);
    float vignette = smoothstep(0.7, 0.0, dist);

    gl_FragColor = vec4(color, vignette * 0.7);
  }
`

const uniforms = {
  time: { value: 0 },
  intensity: { value: 1.0 },
  color1: { value: new THREE.Color(props.color1) },
  color2: { value: new THREE.Color(props.color2) },
}

function buildScene() {
  scene = new THREE.Scene()
  startTime = performance.now()

  // Use OrthographicCamera so the plane fills the entire viewport
  const aspect = window.innerWidth / window.innerHeight
  camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 50)
  camera.position.z = 1.85 // close enough so 2x2 plane fills viewport at FOV 55

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value!,
    antialias: true,
    alpha: true,
  })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 0)

  // Shader plane — sized to fill the viewport
  const vFov = (55 * Math.PI) / 180
  const planeHeight = 2 * Math.tan(vFov / 2) * 1.85
  const planeWidth = planeHeight * aspect
  const planeGeo = new THREE.PlaneGeometry(planeWidth * 1.2, planeHeight * 1.2, 32, 32)
  const planeMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
  })
  shaderMesh = new THREE.Mesh(planeGeo, planeMat)
  shaderMesh.position.set(0, 0, 0)
  scene.add(shaderMesh)

  // Energy ring
  if (props.showRing) {
    const ringGeo = new THREE.RingGeometry(props.ringRadius * 0.8, props.ringRadius, 32)
    const ringMat = new THREE.MeshBasicMaterial({
      color: props.ringColor,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide,
    })
    ringMesh = new THREE.Mesh(ringGeo, ringMat)
    ringMesh.position.set(1.5, 0.5, -0.5)
    scene.add(ringMesh)
  }
}

function animate() {
  raf = requestAnimationFrame(animate)
  const elapsed = (performance.now() - startTime) / 1000

  // Update shader uniforms
  uniforms.time.value = elapsed
  uniforms.intensity.value = 1.0 + Math.sin(elapsed * 2) * 0.3

  // Rotate energy ring
  if (ringMesh) {
    ringMesh.rotation.z = elapsed
    ;(ringMesh.material as THREE.MeshBasicMaterial).opacity =
      0.5 + Math.sin(elapsed * 3) * 0.3
  }

  renderer.render(scene, camera)
}

function onResize() {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// Reactively update shader colors
watch(() => [props.color1, props.color2], () => {
  uniforms.color1.value.set(props.color1)
  uniforms.color2.value.set(props.color2)
})

onMounted(() => {
  buildScene()
  animate()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', onResize)
  renderer?.dispose()
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="absolute inset-0 w-full h-full pointer-events-none"
  />
</template>
