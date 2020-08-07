const $play = document.getElementById('btn-play')
//const $again = document.getElementById('btn-again')

document.addEventListener('DOMContentLoaded', () => {
	//statusButton($again)

	$play.addEventListener('click', (e) => {
		main()
		statusButton($play)
		$play.textContent = 'Again'
		//statusButton($again)
	})
	/* $again.addEventListener('click', (e) => {
		statusButton($again)
		main()
	}) */
})

function statusButton(btn) {
	btn.disabled = !btn.disabled
}

function main() {
	// todos los divs (225)
	const squares = document.querySelectorAll('.grid div')
	// para mostrar el puntaje
	const resultDisplay = document.querySelector('#result')

	let width = 15
	// indice actual de tiradores -- posicion de la nave
	let currentShooterIndex = 202
	// indice actual de invasores
	let currentInvaderIndex = 0
	// invasores alienigenas derrivados
	let alienInvadersTakenDown = []
	let result = 0
	let direction = 1
	let invaderId

	// definimos a los invasores alienigenas -- aray wit 40 elements
	let alienInvaders = [
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		15,
		16,
		17,
		18,
		19,
		20,
		21,
		22,
		23,
		24,
		30,
		31,
		32,
		33,
		34,
		35,
		36,
		37,
		38,
		39,
	]

	function cleanSpace() {
		statusButton($play)

		document.removeEventListener('keydown', moveShooter)
		document.removeEventListener('keyup', shoot)
		/* squares[currentShooterIndex].classList.remove('shooter')
		squares[currentShooterIndex].classList.remove('invader')
		squares[currentShooterIndex].classList.remove('boom')
		squares[currentShooterIndex].classList.remove('laser') */
		squares.forEach((square) => {
			square.classList.remove('shooter')
			square.classList.remove('invader')
			square.classList.remove('boom')
			square.classList.remove('laser')
		})
		resultDisplay.textContent = 0
		width = 15
		currentShooterIndex = 202
		currentInvaderIndex = 0
		alienInvadersTakenDown = []
		result = 0
		direction = 1
		clearInterval(invaderId)

		alienInvaders = [
			0,
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			15,
			16,
			17,
			18,
			19,
			20,
			21,
			22,
			23,
			24,
			30,
			31,
			32,
			33,
			34,
			35,
			36,
			37,
			38,
			39,
		]
	}

	// draw the alien invaders
	alienInvaders.forEach((invader) =>
		// a cada div se asigna la clase invader
		squares[currentInvaderIndex + invader].classList.add('invader')
	)

	// draw the shooter -- la nave
	squares[currentShooterIndex].classList.add('shooter')

	// move the shooter along a line -- mover la nave
	function moveShooter(e) {
		// dependiendo a donde se mueva, entonces esa clase va a ser la nave

		// remueve la clase de la pos actual
		squares[currentShooterIndex].classList.remove('shooter')

		switch (e.keyCode) {
			case 37:
				// mueve a la izquierda solo hasta que el mod sea diferente de cero, en las pos 195 ya no mueve
				if (currentShooterIndex % width !== 0) {
					currentShooterIndex -= 1
				}
				break

			case 39:
				// mueve a la izquierda solo hasta que el mod sea diferente de cero, en las pos 195 ya no mueve
				if (currentShooterIndex % width < width - 1) {
					currentShooterIndex += 1
				}
				break
		}

		squares[currentShooterIndex].classList.add('shooter')
	}

	// llamamos a la funcion para mover la nave
	document.addEventListener('keydown', moveShooter)

	// move the alien invaders --> mover a los aliens
	function moveInvaders() {
		// toma el valor de true
		const leftEdge = alienInvaders[0] % width === 0
		// toma el valor de false
		const rightEdge =
			alienInvaders[alienInvaders.length - 1] % width === width - 1

		// si leftEdge y direction son false
		// o si rightEdge y direction son true
		if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
			direction = width
		} else if (direction === width) {
			// si la direccion es igual al ancho 15 = 15
			if (leftEdge) {
				direction = 1
			} else {
				direction = -1
			}
		}

		// ESTOS FOR NO ENTIENDO MUY BIEN
		for (let i = 0; i <= alienInvaders.length - 1; i++) {
			squares[alienInvaders[i]].classList.remove('invader')
		}
		for (let i = 0; i <= alienInvaders.length - 1; i++) {
			alienInvaders[i] += direction
		}
		for (let i = 0; i <= alienInvaders.length - 1; i++) {
			if (!alienInvadersTakenDown.includes(i)) {
				squares[alienInvaders[i]].classList.add('invader')
			}
		}

		// mostrar el game over -> verificamos si la nave tiene 2 clases
		if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
			// resultDisplay.textContent = 'Game Over'
			swal('Game Over!', 'You are a bad player 😔', 'error')
			/* squares[currentShooterIndex].classList.remove('invader')
			squares[currentShooterIndex].classList.remove('shooter')
			squares[currentShooterIndex].classList.add('boom')
      clearInterval(invaderId) */

			cleanSpace()
			//statusButton($play)
			// statusButton($again)
		}

		for (let i = 0; i <= alienInvaders.length - 1; i++) {
			// i > 25
			if (alienInvaders[i] > squares.length - (width - 1)) {
				resultDisplay.textContent = 'Game Over'
				clearInterval(invaderId)
			}
		}

		// decidir si gano
		if (alienInvadersTakenDown.length === alienInvaders.length) {
			// resultDisplay.textContent = 'You Win'
			swal('Congratulations !!!', 'You win 😁', 'success')
			//clearInterval(invaderId)

			cleanSpace()
			//statusButton($play)
			// statusButton($again)
		}
	}
	// movemos a los aliens
	invaderId = setInterval(moveInvaders, 500)

	// shot at aliens
	function shoot(e) {
		let laserId
		let currentLaserIndex = currentShooterIndex

		// move the laser from the shooter to the alien invador -disparamos-
		function moveLaser() {
			squares[currentLaserIndex].classList.remove('laser')
			currentLaserIndex -= width

			// el div con la pos del laser, este tiene la pos de la nave se convertira en una bala
			squares[currentLaserIndex].classList.add('laser')

			// si la posicion actual de la bala tiene la clase invader, es decir cuando hay colision
			if (squares[currentLaserIndex].classList.contains('invader')) {
				// a las pos actual del laser le quita la clase laser e invader y le agrega la clase boom
				squares[currentLaserIndex].classList.remove('laser')
				squares[currentLaserIndex].classList.remove('invader')
				squares[currentLaserIndex].classList.add('boom')

				setTimeout(
					() => squares[currentLaserIndex].classList.remove('boom'),
					250
				)
				clearInterval(laserId)

				// guarda el indice de alienInvaders
				const alienTakeDown = alienInvaders.indexOf(currentLaserIndex)
				// lo guarda en el array inicial
				alienInvadersTakenDown.push(alienTakeDown)
				result++
				// mostramos los puntajes
				resultDisplay.textContent = result
			}

			if (currentLaserIndex < width) {
				clearInterval(laserId)
				setTimeout(
					() => squares[currentLaserIndex].classList.remove('laser'),
					100
				)
			}
		}

		/* document.addEventListener('keyup', (e) => {
			if (e.keyCode === 32) {
				laserId = setInterval(moveLaser, 100)
			}
    }) */

		switch (e.keyCode) {
			case 32:
				laserId = setInterval(moveLaser, 100)
				break
		}
	}

	document.addEventListener('keyup', shoot)
}
