import { getDomElements } from './utils/domElements';
import { windowResizeEventListener, loadRenderer, addBackground } from './utils/sceneManagement'
import { createComputerButtons } from '../common/ComputerDom.js'
import * as THREE from 'three';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js'
import { XRHandModelFactory } from 'three/examples/jsm/webxr/XRHandModelFactory.js'
import * as DVThree from '@desktop.vision/js-sdk/dist/three.min'

const desktopVisionApiCredentials =  require('../.config.json')


export function loadThreeExample() {

	const {
		Computer,
		DesktopVisionAuthenticator,
		DesktopVisionClient,
	} = DVThree.loadSDK(THREE, XRControllerModelFactory, XRHandModelFactory, desktopVisionApiCredentials);

	let desktop;

	const { newCodeButton, computersContainer, validateCodeButton, getComputersButton, createTestComputerButton, codeError, computersError, tokenError, tokenField, codeField } = getDomElements()

	const desktopVisionAuthenticator = new DesktopVisionAuthenticator();
	const desktopVisionClient = new DesktopVisionClient()

	const scene = new THREE.Scene();
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	const camera = new THREE.PerspectiveCamera();
	camera.position.set(0, 1.6, 0);

	function renderLoop(time) {
		if (desktop) {
			desktop.update()
		}
		renderer.render(scene, camera);
	}

	loadRenderer(renderer, renderLoop)
	addBackground(scene)
	generateCode()

	windowResizeEventListener(camera, renderer)


	newCodeButton.onclick = generateCode
	createTestComputerButton.onclick = createTestComputer

	function handleError(err, field) {
		field.textContent = err.message
	}

	function reset() {
		codeField.textContent = ""
		codeError.textContent = ""
		desktopVisionClient.disconnectFromComputers()
		windowResizeEventListener(camera, renderer)
	}

	async function generateCode() {
		reset()
		try {
			const code = await desktopVisionAuthenticator.loadCode(desktopVisionApiCredentials)
			if (!code) throw new Error("Error loading code")
			codeField.textContent = code.code
			const res = await desktopVisionAuthenticator.waitForAuthToken(desktopVisionApiCredentials, code.code)
			if (res) fetchAndConnectToDefaultComputer()
		} catch (e) {
			handleError(e, codeError)
		}
	}

	async function fetchAndConnectToDefaultComputer() {
		try {
			const token = desktopVisionAuthenticator.token
			const computers = await desktopVisionClient.getComputers(token)
			const computer = computers.find(c => c.id === token.computer)
			connectToComputer(computer)
		} catch (e) {
			handleError(e, computersError)
		}
	}

	async function connectToComputer(computer) {
		const computerConnection = await desktopVisionClient.connectToComputer(desktopVisionAuthenticator.token, computer)
		computerConnection.on("stream-added", (stream) => {
			const video = document.getElementById("video-stream");
			video.setAttribute('webkit-playsinline', 'webkit-playsinline');
			video.setAttribute('playsinline', 'playsinline');
			video.srcObject = stream;
			video.muted = false
			video.play();

			createComputer(computerConnection);
		});
	}


	function removeComputer() {
		if (desktop) desktop.destroy()
	}

	function createComputer(computerConnection) {
		removeComputer()
		const { sceneContainer, video } = getDomElements()

		const desktopOptions = {
			renderScreenBack: true,
			initialScalar: 1,
			initialWidth: 2,
			hideMoveIcon: false,
			hideResizeIcon: false,
			includeKeyboard: true,
			renderAsLayer: false,
			keyboardOptions: {
				hideMoveIcon: false,
				hideResizeIcon: false,
				keyColor: 'rgb(50, 50, 50)',
				highlightColor: 'rgb(50, 75, 100)',
			},
			xrOptions: {
				hideControllers: false,
				hideHands: false,
				hideCursors: false,
			},
		}

		desktop = new Computer(scene, sceneContainer, video, renderer, computerConnection, camera, desktopOptions);
		desktop.position.y = 1.6
		desktop.position.z = -2

		scene.add(desktop);
	}

	function createTestComputer() {
		console.log("test pc")
		const video = document.getElementById("video-stream")
		video.setAttribute('webkit-playsinline', 'webkit-playsinline');
		video.setAttribute('playsinline', 'playsinline');
		video.src = '/dvVid.mp4';
		video.muted = true
		video.play();
		video.loop = true

		createComputer()
	}
}