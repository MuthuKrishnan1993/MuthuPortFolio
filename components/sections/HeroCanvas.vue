<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { useColorMode } from '#imports'

const canvasRef = ref<HTMLCanvasElement>()
const colorMode = useColorMode()

let renderer: THREE.WebGLRenderer
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let raf: number
let startTime: number

// Particle system
let pointsMesh: THREE.Points
let linesMesh: THREE.LineSegments
let pointPositions: Float32Array
let pointVelocities: Float32Array
let linePositions: Float32Array
let lineColors: Float32Array

const PARTICLE_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 55 : 90
const LINK_DIST = 2.6
const LINK_DIST_SQ = LINK_DIST * LINK_DIST
const MAX_LINKS = 350
const BOUNDS = 5.5

let mouse = { x: 0, y: 0 }
let targetMouse = { x: 0, y: 0 }

function getColors() {
  const dark = colorMode.value === 'dark'
  return {
    bg:         dark ? 0x000000 : 0xf5f5f7,
    particleR:  dark ? 0.45 : 0.11,
    particleG:  dark ? 0.65 : 0.11,
    particleB:  dark ? 1.0  : 0.12,
    lineR:      dark ? 0.0 : 0.0,
    lineG:      dark ? 0.44 : 0.44,
    lineB:      dark ? 0.89 : 0.89,
  }
}

function buildScene() {
  const c = getColors()
  scene = new THREE.Scene()
  startTime = performance.now()

  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 50)
  camera.position.z = 8

  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value!, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 0)

  // ── Particles ────────────────────────────────────────────
  pointPositions  = new Float32Array(PARTICLE_COUNT * 3)
  pointVelocities = new Float32Array(PARTICLE_COUNT * 3)
  const pointColors = new Float32Array(PARTICLE_COUNT * 3)
  const pointSizes  = new Float32Array(PARTICLE_COUNT)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pointPositions[i * 3]     = (Math.random() - 0.5) * BOUNDS * 2
    pointPositions[i * 3 + 1] = (Math.random() - 0.5) * BOUNDS * 2
    pointPositions[i * 3 + 2] = (Math.random() - 0.5) * 2

    const speed = 0.004 + Math.random() * 0.008
    const angle = Math.random() * Math.PI * 2
    pointVelocities[i * 3]     = Math.cos(angle) * speed
    pointVelocities[i * 3 + 1] = Math.sin(angle) * speed
    pointVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002

    // Slightly varied brightness
    const bright = 0.7 + Math.random() * 0.3
    pointColors[i * 3]     = c.particleR * bright
    pointColors[i * 3 + 1] = c.particleG * bright
    pointColors[i * 3 + 2] = c.particleB * bright

    // Some "hub" nodes are bigger
    pointSizes[i] = i < 8 ? 3.5 : 1.8 + Math.random() * 1.5
  }

  const pGeo = new THREE.BufferGeometry()
  pGeo.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3).setUsage(THREE.DynamicDrawUsage))
  pGeo.setAttribute('color', new THREE.BufferAttribute(pointColors, 3))
  pGeo.setAttribute('size', new THREE.BufferAttribute(pointSizes, 1))

  const pMat = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85,
  })

  pointsMesh = new THREE.Points(pGeo, pMat)
  scene.add(pointsMesh)

  // ── Connection lines ─────────────────────────────────────
  linePositions = new Float32Array(MAX_LINKS * 2 * 3)
  lineColors    = new Float32Array(MAX_LINKS * 2 * 3)

  const lGeo = new THREE.BufferGeometry()
  lGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage))
  lGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage))
  lGeo.setDrawRange(0, 0)

  const lMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: colorMode.value === 'dark' ? 0.55 : 0.35,
    blending: colorMode.value === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending,
    depthWrite: false,
  })

  linesMesh = new THREE.LineSegments(lGeo, lMat)
  scene.add(linesMesh)
}

function updateLines() {
  const c = getColors()
  let linkCount = 0

  for (let i = 0; i < PARTICLE_COUNT && linkCount < MAX_LINKS; i++) {
    const ix = pointPositions[i * 3]
    const iy = pointPositions[i * 3 + 1]
    const iz = pointPositions[i * 3 + 2]

    for (let j = i + 1; j < PARTICLE_COUNT && linkCount < MAX_LINKS; j++) {
      const dx = ix - pointPositions[j * 3]
      const dy = iy - pointPositions[j * 3 + 1]
      const dz = iz - pointPositions[j * 3 + 2]
      const distSq = dx * dx + dy * dy + dz * dz

      if (distSq < LINK_DIST_SQ) {
        const alpha = 1 - Math.sqrt(distSq) / LINK_DIST
        const base = linkCount * 6

        // vertex A
        linePositions[base]     = ix
        linePositions[base + 1] = iy
        linePositions[base + 2] = iz
        lineColors[base]        = c.lineR * alpha
        lineColors[base + 1]    = c.lineG * alpha
        lineColors[base + 2]    = c.lineB * alpha

        // vertex B
        linePositions[base + 3] = pointPositions[j * 3]
        linePositions[base + 4] = pointPositions[j * 3 + 1]
        linePositions[base + 5] = pointPositions[j * 3 + 2]
        lineColors[base + 3]    = c.lineR * alpha * 0.5
        lineColors[base + 4]    = c.lineG * alpha * 0.5
        lineColors[base + 5]    = c.lineB * alpha * 0.5

        linkCount++
      }
    }
  }

  const lGeo = linesMesh.geometry
  ;(lGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true
  ;(lGeo.attributes.color    as THREE.BufferAttribute).needsUpdate = true
  lGeo.setDrawRange(0, linkCount * 2)
}

function animate() {
  raf = requestAnimationFrame(animate)
  const elapsed = (performance.now() - startTime) / 1000

  // Smooth mouse lag
  mouse.x += (targetMouse.x - mouse.x) * 0.04
  mouse.y += (targetMouse.y - mouse.y) * 0.04

  // Camera gentle parallax
  camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04
  camera.position.y += (mouse.y * 0.4 - camera.position.y) * 0.04
  camera.lookAt(scene.position)

  // Update particles
  const pAttr = pointsMesh.geometry.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    let px = pointPositions[i * 3]
    let py = pointPositions[i * 3 + 1]
    let pz = pointPositions[i * 3 + 2]

    // Subtle sine wobble per particle
    const wobble = Math.sin(elapsed * 0.4 + i * 0.7) * 0.0008
    pointVelocities[i * 3 + 1] += wobble

    px += pointVelocities[i * 3]
    py += pointVelocities[i * 3 + 1]
    pz += pointVelocities[i * 3 + 2]

    // Soft boundary (reflect)
    if (Math.abs(px) > BOUNDS) { pointVelocities[i * 3]     *= -0.95; px = Math.sign(px) * BOUNDS }
    if (Math.abs(py) > BOUNDS) { pointVelocities[i * 3 + 1] *= -0.95; py = Math.sign(py) * BOUNDS }
    if (Math.abs(pz) > 1.5)   { pointVelocities[i * 3 + 2] *= -0.95; pz = Math.sign(pz) * 1.5 }

    pointPositions[i * 3]     = px
    pointPositions[i * 3 + 1] = py
    pointPositions[i * 3 + 2] = pz
  }
  pAttr.needsUpdate = true

  updateLines()
  renderer.render(scene, camera)
}

function onMouseMove(e: MouseEvent) {
  targetMouse.x = (e.clientX / window.innerWidth - 0.5) * 2
  targetMouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// Sync opacity & blending when theme changes
watch(() => colorMode.value, () => {
  const mat = linesMesh.material as THREE.LineBasicMaterial
  mat.opacity   = colorMode.value === 'dark' ? 0.55 : 0.35
  mat.blending  = colorMode.value === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending
  mat.needsUpdate = true

  const c = getColors()
  const pColors = pointsMesh.geometry.attributes.color as THREE.BufferAttribute
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const b = 0.7 + Math.random() * 0.3
    pColors.array[i * 3]     = c.particleR * b
    pColors.array[i * 3 + 1] = c.particleG * b
    pColors.array[i * 3 + 2] = c.particleB * b
  }
  pColors.needsUpdate = true
})

onMounted(() => {
  buildScene()
  animate()
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('resize', onResize)
  renderer.dispose()
})
</script>

<template>
  <canvas ref="canvasRef" class="hero-canvas absolute inset-0 w-full h-full pointer-events-none" />
</template>
