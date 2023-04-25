import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')

/**
 *  Particles 
*/
// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 5000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 30
    colors[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// Material
const particleMaterial = new THREE.PointsMaterial({
    size: 0.4,
    sizeAttenuation: true,
    // color: '#ff88cc',
    alphaMap: particleTexture,
    transparent: true,
    // alphaTest: 0.001,
    // depthTest: false,
    depthWrite: false
})
particleMaterial.blending = THREE.AdditiveBlending
particleMaterial.vertexColors = true

// Points
const particles = new THREE.Points(particlesGeometry, particleMaterial)
scene.add(particles)

// CUbe
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock();

// GUI parameters
const parameters = {
  cosValue: 0,
  sinValue: 1,
  cotValue: 0,
  tanValue: 0,
  secValue: 0,
  cosecValue: 0,
};

// GUI
gui.add(parameters, "cosValue").min(0).max(10).step(0.1);
gui.add(parameters, "sinValue").min(0).max(10).step(0.1);
gui.add(parameters, "cotValue").min(0).max(10).step(0.1);
gui.add(parameters, "tanValue").min(0).max(10).step(0.1);
gui.add(parameters, "secValue").min(0).max(10).step(0.1);
gui.add(parameters, "cosecValue").min(0).max(10).step(0.1);

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  const cosValue = parameters.cosValue
  const sinValue = parameters.sinValue
  const cotValue = parameters.cotValue
  const tanValue = parameters.tanValue
  const secValue = parameters.secValue
  const cosecValue = parameters.cosecValue

  particlesGeometry.attributes.position.needsUpdate = true

  for (let i = 0; i < count; i++) {
    const i3 = i * 3

    const x = particlesGeometry.attributes.position.array[i3]
    const y = particlesGeometry.attributes.position.array[i3 + 1]
    const z = particlesGeometry.attributes.position.array[i3 + 2]

    particlesGeometry.attributes.position.array[i3 + 1] =
      (sinValue * Math.sin(elapsedTime + x) +
        cosValue * Math.cos(elapsedTime + x) +
        cotValue * 1 / Math.tan(elapsedTime + x) +
        tanValue * Math.tan(elapsedTime + x) +
        secValue * 1 / Math.cos(elapsedTime + x) +
        cosecValue * 1 / Math.sin(elapsedTime + x))
  }
  
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();


