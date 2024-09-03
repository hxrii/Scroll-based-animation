import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'
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
            particlesMaterial.color.set(parameters.materialColor)
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








//Mesh positions
const objectsDistance = 4

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2


const sectionMeshes = [ mesh1, mesh2, mesh3 ]




//paricles
const particleCnt = 1000;
const positions = new Float32Array(particleCnt*3);
for(let i = 0; i < particleCnt; i++)
    {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 10
        positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))


const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

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
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

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
let previousTime = 0;

const cursor = {}
cursor.x = 0;
cursor.y =0;


addEventListener('mousemove',(e)=>{
    cursor.x = e.clientX / sizes.width -0.5
    cursor.y = e.clientY / sizes.height -0.5
})




let scrollY = window.scrollY
let currentSection = 0


window.addEventListener('scroll', () =>
    {
        scrollY = window.scrollY
    
        const newSection = Math.round(scrollY / sizes.height)
        if(newSection != currentSection)
            {
                currentSection = newSection
        
                gsap.to(sectionMeshes[currentSection].rotation,{
                    duration: 1.5,
                    ease: 'power2.inOut',
                    x: '+=6',
                    y: '+=3',
                    z: '+=1.5'
                })
            }
    })

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime-previousTime
    previousTime = elapsedTime
    // Render
    renderer.render(scene, camera)
    

    let scrollY = window.scrollY
    camera.position.y = - scrollY / sizes.height * objectsDistance
    mesh1.position.x = 1
    mesh2.position.x = - 1
    mesh3.position.x = 1
    for(const mesh of sectionMeshes)
        {
            mesh.rotation.x += deltaTime * 0.1
            mesh.rotation.y += deltaTime * 0.12
        }

    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    const parallaxX = cursor.x /2
    const parallaxY = - cursor.y /2
    
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * deltaTime*5;
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * deltaTime*5;
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()