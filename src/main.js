import { loadFlatExample } from './2d/main.js'
import { loadThreeExample } from './three/main.js'
import { loadThreeAutomatedExample } from './three-automated/main.js'

function locationHashChanged() {
    const exampleFrame = document.getElementById('example-frame')
    const hash = location.hash
    if (hash === "") {
        exampleFrame.src = ""
    } else if (hash === "#2d") {
        exampleFrame.src = "./2d/index.html"
    } else if (hash === "#three") {
        exampleFrame.src = "./three/index.html"
    } else if (hash === "#threeautomated") {
        exampleFrame.src = "./three-automated/index.html"
    }
}

window.locationHashChanged = locationHashChanged
window.addEventListener('hashchange', locationHashChanged);

window.loadFlatExample = loadFlatExample
window.loadThreeExample = loadThreeExample
window.loadThreeAutomatedExample = loadThreeAutomatedExample