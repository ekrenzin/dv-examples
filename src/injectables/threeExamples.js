
var dvScript = document.createElement('script')
var threeScript = document.createElement('script')
const video = document.createElement("video")
dvScript.src = 'https://js.desktop.vision/three/v3.0.0/bundle.min.js'
threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.148.0/three.min.js"
document.body.appendChild(dvScript)
document.body.appendChild(threeScript)

let threeLoaded = false, dvLoaded = false

dvScript.onload = function () {
	console.log("DV loaded")
	dvLoaded = true
	attemptToLoadComputer()
}
threeScript.onload = function () {
	console.log("three loaded")
	threeLoaded = true
	attemptToLoadComputer()
}

function attemptToLoadComputer() {
	if (dvLoaded && threeLoaded) {
		loadComputer()
	}
}
const iframe = document.getElementsByTagName("iframe")[0];
const iframeScripts = iframe.contentWindow.document.getElementsByTagName("script");
for (const script of iframeScripts) {
	//read the script
	script.onload = function () {
		console.log("iframe script loaded")
	}

}

async function waitForCanvas() {
	console.log("waiting for canvas")
	return new Promise((resolve, reject) => {
		const interval = setInterval(() => {
			console.log("waiting for canvas")
			const iframeCanvases = iframe.contentWindow.document.getElementsByTagName("canvas");
			const canvases = [...iframeCanvases, document.getElementsByTagName('canvas')]
			if (canvases.length > 0) {
				clearInterval(interval)
				resolve(canvases[0])
			}
		}, 100)
	})
}

async function loadComputer() {
	const { ManagedComputer } = DesktopVision.loadSDK(THREE, null, null);
	const desktopVisionApiCredentials = {
		id: "6wlqRxEgp60JXkcGkLY2",
		key: "bc7013db-c339-4141-92fb-f24486d47d35"
	}
	const video = document.createElement('video')
	//get all html canvases
	const oldCanvas = await waitForCanvas()
	const gl = oldCanvas.getContext('webgl');

	console.log({ oldCanvas, gl })
	//get the first canvas
	const newCanvas = document.createElement('canvas');
	//remove pointer events from new canvas
	newCanvas.style.pointerEvents = "none";

	//bring new canvas to front
	newCanvas.style.position = "absolute";
	newCanvas.style.top = "0px";
	newCanvas.style.left = "0px";
	newCanvas.style.zIndex = "1000";

	//set the size of the new canvas to the size of the old canvas
	newCanvas.width = oldCanvas.width;
	newCanvas.height = oldCanvas.height;

	//the scenecontainer is the parent of the old canvas
	const sceneContainer = oldCanvas.parentElement;

	// const scene = canvas.scene
	// const scene = editor.scene
	const scene = new THREE.Scene()

	const camera = new THREE.PerspectiveCamera();
	camera.position.set(0, 1.6, 0);
	const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: newCanvas, alpha: true, autoClear: false });

	//setup renderer
	renderer.setSize(newCanvas.width, newCanvas.height);
	renderer.setPixelRatio(window.devicePixelRatio);
	console.log({ height: newCanvas.height, width: newCanvas.width, pixelRatio: window.devicePixelRatio })

	renderer.setClearColor(0x000000, 0);
	sceneContainer.appendChild(renderer.domElement);

	///start render loop
	function render() {
		try {
			requestAnimationFrame(render);
			renderer.render(scene, camera);
		} catch (e) {
			console.error(e)
		}
	}

	render();

	camera.position.set(0, 1.6, 0);

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
}