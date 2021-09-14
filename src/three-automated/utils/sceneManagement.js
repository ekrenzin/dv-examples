
import * as THREE from 'three';
import { getDomElements } from "./domElements";
import Cubes from '../misc/Cubes'
import Lights from '../misc/Lights'
export { windowResizeEventListener, loadRenderer, addBackground }

function windowResizeEventListener(camera, renderer) {
	const { sceneContainer } = getDomElements()
	const sceneBounds = sceneContainer.getBoundingClientRect();
	const { width, height } = sceneBounds
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
	renderer.setSize(width - 4, height - 4);
	window.onresize = () => windowResizeEventListener(camera, renderer)
}


function loadRenderer(renderer, renderLoop) {
	const { sceneContainer } = getDomElements()
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(window.innerWidth, window.innerHeight)

	renderer.shadowMap.enabled = true
	renderer.xr.enabled = true
	renderer.outputEncoding = THREE.sRGBEncoding
	renderer.localClippingEnabled = true
	renderer.xr.setFramebufferScaleFactor(2.0);
	renderer.outputEncoding = THREE.sRGBEncoding

	renderer.setAnimationLoop(renderLoop);
	sceneContainer.appendChild(renderer.domElement);
}

function addBackground(scene) {

	const cubes = new Cubes(scene)
	const lights = new Lights(scene)
	cubes.addToScene()
	lights.addToScene()
	scene.background = new THREE.Color('rgb(33,30,50)')
}