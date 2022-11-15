// Для запуска проекта, достаточно запустить любой live server,
// например в vs code, или в webstorm

export default class RotateElement {
	constructor() {
		this.container = document.querySelector('.container__inner')

		this.startTouches = null;
		this.init()
		console.log(this.container)

	}

	init = () => {
		console.log('Ваш код...')
		this.container.addEventListener('pointerdown', this.pointerDown)
		this.container.addEventListener('pointermove', this.pointerMove)

	}


	pointerDown = (event) => {
		this.startTouches = event.pageY
		console.log('Тут указал первый Y ' + this.startTouches)
	}

	pointerMove = (event) => {
		if (event.pressure <= 0) return

		const moveTouches = event.pageY

		const defferenceMove = moveTouches - this.startTouches;
		this.container.style.transform = "rotate(50px)"
	}

}


