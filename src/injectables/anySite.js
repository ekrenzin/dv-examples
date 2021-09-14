
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

function windowResizeEventListener(sceneContainer, camera, renderer) {
	const width = sceneContainer.clientWidth
	const height = sceneContainer.clientHeight
	console.log({width, height})
	if (width === 0) {
        width = window.innerWidth
    }
    if (height === 0) {
        height = window.innerHeight
    }
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

async function waitForCanvas(attempts) {
    const maxAttempts = attempts || 10
    let numberOfAttempts = 0
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            numberOfAttempts++
            const canvases = document.getElementsByTagName('canvas')
            if (canvases.length > 0) {
                clearInterval(interval)
                resolve(canvases[0])
            }
            if (numberOfAttempts >= maxAttempts) {
                console.log("max attempts reached")
                clearInterval(interval)
                //create canvas the size of the viewport
                const canvas = document.createElement('canvas')
                canvas.width = window.innerWidth
                canvas.height = window.innerHeight
                canvas.style.pointerEvents = "none"

                //create div which covers the screen at the top
                const div = document.createElement('div')
                div.style.position = "fixed"
                div.style.top = "0px"
                div.style.left = "0px"
                div.style.width = "100%"
                div.style.height = "100%"
                div.style.zIndex = "1000"

                //add div to the document
                document.body.appendChild(div)


                //add canvas to the div
                div.appendChild(canvas)
                resolve(canvas)
            }
        }, 100)
    })
}

async function loadComputer() {
    console.log("LOADING COMPUTER")

    const { ManagedComputer } = DesktopVision.loadSDK(THREE, null, null);
    const desktopVisionApiCredentials = {
        id: "6wlqRxEgp60JXkcGkLY2",
        key: "bc7013db-c339-4141-92fb-f24486d47d35"
    }
    const video = document.createElement('video')
    //get all html canvases
    const oldCanvas = await waitForCanvas()
    //if the canvas parent is the body element, add it to a div
    if (oldCanvas.parentElement === document.body) {
        const div = document.createElement('div')
        div.style.position = "relative"
        div.style.width = "100vw"
        div.style.height = "100vh"
        document.body.appendChild(div)
        div.appendChild(oldCanvas)
    }


    //get the first canvas
    const newCanvas = document.createElement('canvas');
    //remove pointer events from new canvas

    //bring new canvas to front
    newCanvas.style.position = "absolute";
    newCanvas.style.top = "0px";
    newCanvas.style.left = "0px";
    newCanvas.style.zIndex = "1000";
    newCanvas.style.pointerEvents = "none";


    //the scenecontainer is the parent of the old canvas
    const sceneContainer = oldCanvas.parentElement;

    const scene = new THREE.Scene();
    // const scene = editor.scene
    const camera  = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    // const camera = window.editor.camera
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: newCanvas, alpha: true, autoClear: false });
	renderer.shadowMap.enabled = true
	renderer.xr.enabled = true
	renderer.outputEncoding = THREE.sRGBEncoding
	renderer.localClippingEnabled = true
	renderer.xr.setFramebufferScaleFactor(2.0);
	renderer.outputEncoding = THREE.sRGBEncoding

    //setup renderer
    const { height, width } = oldCanvas
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    console.log({ height: newCanvas.height, width: newCanvas.width, pixelRatio: window.devicePixelRatio })


    renderer.setClearColor(0x000000, 0);
    sceneContainer.appendChild(renderer.domElement);
	//add event listener for window resize
	window.addEventListener('resize', () => windowResizeEventListener(sceneContainer, camera, renderer), false);
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

    console.log("COMPUTER LOADED", desktop)
    window.desktop = desktop


    async function enterVR(renderer) {
        try {
            const sessionOptions = { optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"] }
            const session = await navigator.xr.requestSession("immersive-vr", sessionOptions);
            renderer.xr.setReferenceSpaceType("local-floor");
            renderer.xr.setSession(session);
        } catch (e) {
            console.log(e)
        }
    }
    window.enterVR = () => enterVR(renderer)

    //when the user presses shift + d new canvas should toggle pointer events
    document.addEventListener('keydown', (e) => {
        if (e.key.toLocaleLowerCase() === "d" && e.shiftKey) {
            if (newCanvas.style.pointerEvents === "none") {
                newCanvas.style.pointerEvents = "auto"
				sceneContainer.style.pointerEvents = "auto"
            } else {
                newCanvas.style.pointerEvents = "none"
				sceneContainer.style.pointerEvents = "none"
            }
        }
    })
    
    desktop.controls.addEventListener('selectStart', (e) => {
        console.log(e)
    })
    
}
