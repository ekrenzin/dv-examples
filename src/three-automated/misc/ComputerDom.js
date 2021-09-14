import { getDomElements } from "../utils/domElements"
export { createComputerButtons }

function createComputerButtons(computers) {
    const { computersContainer } = getDomElements()
    const computersExist = computers.length > 0
    for (const child of computersContainer.children) computersContainer.removeChild(child)
    if (computersExist) {
        for (const computer of computers) {
            const computerButton = document.createElement('button')
            computerButton.onclick = () => connectToComputer(computer)
            computerButton.textContent = "Stream " + computer.computerName
            computersContainer.appendChild(computerButton)
        }
    } else {
        const missingTextDiv = document.createElement('div')
        missingTextDiv.textContent = "No computers available for this user. Try connecting to a different Desktop Vision account, or connect a streamer app."
        computersContainer.appendChild(missingTextDiv)
    }
}
