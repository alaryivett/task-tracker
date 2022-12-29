function showModal (header, content, onSubmit) {
	const modal = document.createElement('div')
	modal.classList.add('modal')
	modal.setAttribute('id', 'modal')
	modal.addEventListener('click', closeModal)

	const modalWindow = document.createElement('form')
	modalWindow.classList.add('modal__window')
	modalWindow.addEventListener('click', (event) => event.stopPropagation())

	const title = document.createElement('h3')
	title.classList.add('modal__title')
	title.textContent = header
	modalWindow.appendChild(title)

	content.classList.add('modal__content')
	modalWindow.appendChild(content)

	const buttons = document.createElement('div')
	buttons.classList.add('modal__buttons')

	const submitButton = document.createElement('button')
    submitButton.setAttribute('type', 'submit')
	submitButton.classList.add('modal__button_filled')
	submitButton.textContent = 'Сохранить'
	submitButton.addEventListener('click', () => {
		onSubmit()
		closeModal()
	})
	buttons.appendChild(submitButton)

	const closeButton = document.createElement('button')
	closeButton.classList.add('modal__button')
	closeButton.textContent = 'Закрыть'
	closeButton.addEventListener('click', closeModal)
	buttons.appendChild(closeButton)

	modalWindow.appendChild(buttons)
	modal.appendChild(modalWindow)
	document.querySelector('body').appendChild(modal)
}

function closeModal () {
	const modal = document.getElementById('modal')
	document.querySelector('body').removeChild(modal)
}

function createFormInput (type, labelText, placeholder, id, value, onChange) {
    const field = document.createElement('div')
    field.classList.add('modal__field')

    const label = document.createElement('label')
    label.setAttribute('for', id)
    label.textContent = labelText
    field.appendChild(label)

    const input = document.createElement('input')
    input.setAttribute('id', id)
    input.setAttribute('type', type)
    input.setAttribute('placeholder', placeholder)
    input.value = value
    field.appendChild(input)

	input.addEventListener('input', () => onChange(input.value))

    return field
}

function createFormSelect (labelText, id, value, options, onChange) {
    const field = document.createElement('div')
    field.classList.add('modal__field')

    const label = document.createElement('label')
    label.setAttribute('for', id)
    label.textContent = labelText
    field.appendChild(label)

    const select = document.createElement('select')
    field.appendChild(select)

    const createOption = (text) => {
        const option = document.createElement('option')
        option.textContent = text
        option.setAttribute('id', id)
        if (text === value) {
            option.setAttribute('selected', true)
        }

        return option
    }

    select.appendChild(createOption(''))

    options.forEach(option => select.appendChild(createOption(option)))

	select.addEventListener('input', () => onChange(select.value))

    return field
}

function createFormInfoMessage (title, value) {
    const message = document.createElement('p')
    message.classList.add('modal__info-message')

    const messageTitle = document.createElement('span')
    messageTitle.textContent = title + ': '
    message.appendChild(messageTitle)

    const messageValue = document.createElement('span')
    messageValue.textContent = value
    message.appendChild(messageValue)

    return message
}

export default {
	showModal,
    closeModal,
	createFormInput,
	createFormSelect,
	createFormInfoMessage
}