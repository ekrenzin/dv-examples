export { getDomElements }

function getDomElements(){
    
	const sceneContainer = document.getElementById("scene-container");
    const newCodeButton = document.getElementById("dv-create-auth-code")
    const computersContainer = document.getElementById("dv-computers")
    const validateCodeButton = document.getElementById("dv-validate-auth-code")
    const getComputersButton = document.getElementById("dv-get-computers")
    const codeField = document.getElementById("code-field")
    const codeError = document.getElementById("code-error")
    const computersError = document.getElementById("computers-error")
    const tokenError = document.getElementById("token-error")
    const tokenField = document.getElementById("token-field")
    const video = document.getElementById("video-stream");
	const enterSceneButton = document.getElementById("enter-scene-button")
	const createTestComputerButton = document.getElementById("computer-test-button")
	const computerRemoveButton = document.getElementById("computer-remove-button")

    return { newCodeButton, computersContainer, validateCodeButton, getComputersButton, codeField, codeError, computersError, tokenError, tokenField, video, sceneContainer, enterSceneButton, createTestComputerButton, computerRemoveButton }

}