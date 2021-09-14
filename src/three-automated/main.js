import { getDomElements } from './utils/domElements';
import { windowResizeEventListener, loadRenderer, addBackground } from './utils/sceneManagement'
import { enterVR } from './misc/XR';
import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { XRHandModelFactory } from 'three/examples/jsm/webxr/XRHandModelFactory.js'
import { loadSDK } from '@desktop.vision/js-sdk/dist/three.min'

const desktopVisionApiCredentials =  require('../.config.json')

export function loadThreeAutomatedExample() {
	const { sceneContainer, video, enterSceneButton } = getDomElements()
	const { ManagedComputer} = loadSDK(THREE, XRControllerModelFactory, XRHandModelFactory);

	enterSceneButton.onclick = () => enterVR(renderer)

	const scene = new THREE.Scene();
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	const camera = new THREE.PerspectiveCamera();

	//add orbit controls
	const controls = new OrbitControls(camera, renderer.domElement);

	camera.position.set(0, 1.6, 0);
	
	loadRenderer(renderer, (time) => renderer.render(scene, camera))
	addBackground(scene)
	windowResizeEventListener(camera, renderer)

	const desktopOptions = {
		scene,
		camera,
		sceneContainer,
		renderer,
		video
	}
	const desktop = new ManagedComputer(desktopOptions, desktopVisionApiCredentials);
	scene.add(desktop)
	desktop.position.y = 1.6
	desktop.position.z = -1.5
	
	function update() {
        try {
			desktop.trackObject(camera)
            requestAnimationFrame(update);
			controls.update();
        } catch (e) {
            console.error(e)
        }
    }
	update()
}