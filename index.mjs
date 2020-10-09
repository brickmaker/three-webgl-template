import * as THREE from 'https://unpkg.com/three/build/three.module.js';

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// scene

// data
const positions = [
    -2, -1, 0,
    2, -1, 0,
    0, 2.5, 0,
]
const colors = [
    255, 0, 0, 1,
    0, 255, 0, 1,
    0, 0, 255, 1,
]

// attribute buffers, wrapped in a BufferGeometry
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
geometry.setAttribute('color', new THREE.Uint8BufferAttribute(colors, 4, true)) // normalized

// vertex shader & fragment shader, wrapped in RawShaderMaterial
const vertShaderStr = `precision mediump float;
precision mediump int;

// three internally bind transform matrix with camera, don't need set it manually
uniform mat4 modelViewMatrix; // optional
uniform mat4 projectionMatrix; // optional

attribute vec3 position;
attribute vec4 color;

varying vec3 vPosition;
varying vec4 vColor;

void main()	{
    vPosition = position;
    vColor = color;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`
const fragShaderStr = `precision mediump float;
precision mediump int;

varying vec3 vPosition;
varying vec4 vColor;

void main()	{
    gl_FragColor = vColor;
}
`
const material = new THREE.RawShaderMaterial({
    uniforms: {},
    vertexShader: vertShaderStr,
    fragmentShader: fragShaderStr,
    // other options...
})

// object and scene
const mesh = new THREE.Mesh(geometry, material)
const scene = new THREE.Scene();
scene.add(mesh);

// camera
// perspective for general 3D scene
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 3;
camera.lookAt(0, 0, 0)

// ortho for 2D scene
// const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, -100, 100);

renderer.render(scene, camera);

// if we need consider resize
window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
