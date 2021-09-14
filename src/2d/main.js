import { createComputerButtons } from '../common/ComputerDom.js'
import { playVideo } from './utils/video.js'
import * as DVBrowser from '@desktop.vision/js-sdk/dist/flat.min.js'
import { getDomElements } from './utils/domElements.js'

const desktopVisionApiCredentials =  require('../.config.json')

export function loadFlatExample() {
    const { newCodeButton, computersContainer, validateCodeButton, getComputersButton, codeField, codeError, computersError, tokenError, tokenField, video } = getDomElements()


    const {
        DesktopVisionAuthenticator,
        DesktopVisionClient,
        DesktopVisionInteractions
    } = DVBrowser.loadSDK();
    const desktopVisionAuthenticator = new DesktopVisionAuthenticator();
    const desktopVisionClient = new DesktopVisionClient()
    const desktopVisionInteractions = new DesktopVisionInteractions(video)

    newCodeButton.onclick = generateCode
    validateCodeButton.onclick = validateCode
    getComputersButton.onclick = fetchComputers

    function reset() {
        codeField.textContent = ""
        codeError.textContent = ""
        tokenError.textContent = ""
        tokenField.textContent = ""
        computersError.textContent = ""
        for (const child of computersContainer.children) computersContainer.removeChild(child)
        desktopVisionClient.disconnectFromComputers()
    }

    function handleError(err, field) {
        field.textContent = err.message
    }

    async function generateCode() {
        reset()
        try {
            const code = await desktopVisionAuthenticator.loadCode(desktopVisionApiCredentials)
            if (!code) throw new Error("Error loading code")
            codeField.textContent = code.code
        } catch (e) {
            handleError(e, codeError)
        }
    }

    async function validateCode() {
        try {
            const code = codeField.textContent
            await desktopVisionAuthenticator.validateCode(desktopVisionApiCredentials, code)
            tokenField.textContent = `UID: ${desktopVisionAuthenticator.token.uid}`
            if (!token) throw new Error("Error validating code")
        } catch (e) {
            handleError(e, tokenError)
        }
    }

    async function fetchComputers() {
        try {
            const computers = await desktopVisionClient.getComputers(desktopVisionAuthenticator.token)
            createComputerButtons(computers, computersContainer, connectToComputer)
        } catch (e) {
            handleError(e, computersError)
        }
    }


    async function connectToComputer(computer) {
        const computerConnection = await desktopVisionClient.connectToComputer(desktopVisionAuthenticator.token, computer)
        computerConnection.on("stream-added", (stream) => playVideo(stream));
        desktopVisionInteractions.setConnection(computerConnection)
    }
}