async function showLoading (awaitFunction) {
	const loader = document.createElement('div')
	loader.classList.add('loader')
	
	const loaderIcon = document.createElement('img')
	loaderIcon.setAttribute('src', 'loader.svg')
	loaderIcon.setAttribute('alt', 'loader')
	loader.appendChild(loaderIcon)

	const loaderMessage = document.createElement('span')
	loaderMessage.textContent = 'Загрузка'
	loaderMessage.classList.add('loader__message')
	loader.appendChild(loaderMessage)

	document.querySelector('body').appendChild(loader)

	await awaitFunction()
		.then(() => document.querySelector('body').removeChild(document.querySelector('.loader')))
}

export default {
	showLoading
}