import Modal from './index.js'
import UsersApi from '../../api/users.js'
import Tracker from '../tracker/index.js'

let newUserData

function showModal (userData) {
    newUserData = userData
    Modal.showModal('Редактировать пользователя', createModalContent(userData), () => {
        UsersApi.updateUser(newUserData)

        const user = document.getElementById(`user-${userData.id}`)
        user.replaceWith(Tracker.createUser(newUserData))
    })
}

function createModalContent (userData) {
    const content = document.createElement('div')
    
    content.appendChild(
        Modal.createFormInput(
            'text',
            'Имя',
            'Имя',
            'firstname',
            userData.firstName,
            (value) => newUserData.firstName = value
        )
    )

    content.appendChild(
        Modal.createFormInput(
            'text',
            'Фамилия',
            'Фамилия',
            'surname',
            userData.surname,
            (value) => newUserData.surname = value
        )
    )

    content.appendChild(
        Modal.createFormInput(
            'text',
            'Отчество',
            'Отчество',
            'secondname',
            userData.secondName,
            (value) => newUserData.secondName = value
        )
    )

    content.appendChild(
        Modal.createFormInput(
            'text',
            'Никнейм',
            'Никнейм',
            'username',
            userData.username,
            (value) => newUserData.username = value
        )
    )

    const removeButton = document.createElement('button')
    removeButton.setAttribute('type', 'button')
    removeButton.classList.add('modal__button')

    const buttonIcon = document.createElement('img')
    buttonIcon.setAttribute('src', 'remove.svg')
    buttonIcon.setAttribute('alt', 'remove-user')
    removeButton.appendChild(buttonIcon)

    const buttonText = document.createElement('span')
    buttonText.textContent = 'Удалить пользователя'
    removeButton.appendChild(buttonText)

    removeButton.addEventListener('click', () => {
        const userRow = document.getElementById(`calendar-row-user-${userData.id}`)
        userRow.remove()

        UsersApi.removeUser(userData)

        Modal.closeModal()
    })

    content.appendChild(removeButton)

    return content
}

export default {
    showModal
}