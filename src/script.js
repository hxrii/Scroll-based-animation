import * as THREE from 'three'
import GUI from 'lil-gui'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}



//Texture loader
const textureLoader = new THREE.TextureLoader();
const gradientTex = textureLoader.load('/textures/gradients/3.jpg')
gradientTex.magFilter = THREE.NearestFilter
//Objects

const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//MESHTOON MATERIAL
const toonMaterial = new THREE.MeshToonMaterial(
    {   color:parameters.materialColor,
        gradientMap: gradientTex
    })



gui
    .addColor(parameters, 'materialColor')
    .onChange(() =>
        {
            toonMaterial.color.set(parameters.materialColor)
        })



const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    toonMaterial
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    toonMaterial
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    toonMaterial
)

scene.add(mesh1,mesh2,mesh3)


//Adding lights
const light = new THREE.DirectionalLight('#ffffff', 3)
light.position.set(1, 1, 0)
scene.add(light)





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
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()