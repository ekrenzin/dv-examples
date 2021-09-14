export { createComputerCard, createComputerButtons }
function createComputerCard(computer, onclick) {
    const computerCard = document.createElement('div')
    const computerButton = document.createElement('button')
    const computerName = document.createElement('h2')
    
    computerCard.classList.add("device-card")
    computerButton.onclick = onclick

    computerButton.textContent = "Connect"
    computerName.textContent = computer.computerName

    computerCard.appendChild(computerName)
    computerCard.appendChild(computerButton)

    return computerCard
}


function createComputerButtons(computers, container, connectToComputer) {
	for (const child of container.children) container.removeChild(child)
	for (const computer of computers) {
		const computerOnclick = () => connectToComputer(computer)
		const computerCard = createComputerCard(computer, computerOnclick)
		container.appendChild(computerCard)
	}
}