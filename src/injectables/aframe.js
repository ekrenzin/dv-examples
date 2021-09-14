
const dvScript = document.createElement('script')
dvScript.src = 'https://js.desktop.vision/three/v3.0.7/bundle.min.js'

document.body.appendChild(dvScript)
dvScript.onload = function () {
	console.log("DV loaded")
}
async function loadComputer() {
	const { THREE } = AFRAME
	const { ManagedComputer } = DesktopVision.loadSDK(THREE, null, null);
	const desktopVisionApiCredentials = {
		id: "6wlqRxEgp60JXkcGkLY2",
		key: "bc7013db-c339-4141-92fb-f24486d47d35"
	}
	const video = document.createElement('video')
	const sceneContainer = document.querySelector('a-scene')
	const desktopEntity = document.createElement('a-entity')
	const scene = sceneContainer
	const camera = scene.camera
	const renderer = scene.renderer

	renderer.outputEncoding = THREE.sRGBEncoding
	const desktopOptions = {
		scene: scene.object3D,
		camera,
		sceneContainer,
		renderer,
		video,
		initialScalar: 10
	}
	const desktop = new ManagedComputer(desktopOptions, desktopVisionApiCredentials);


	scene.appendChild(desktopEntity)

	desktopEntity.object3D.add(desktop);
	desktopEntity.object3D.position.y = 3
	desktopEntity.object3D.position.z = -8

	desktopEntity.object3D.position = camera.position

	//make the desktop 4x bigger
	desktop.scale.set(4, 4, 4)

	window.camera = camera
	window.desktop = desktop


	function render() {
		try {
			requestAnimationFrame(render);
			desktop.trackObject(camera.parent.parent.parent);
		} catch (e) {
			console.error(e)
		}
	}
	render()
}
