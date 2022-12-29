import Modal from './index.js'
import UsersApi from '../../api/users.js'
import Tracker from '../tracker/index.js'

let newUserData = UsersApi.emptyUser

function showModal () {
    newUserData.id = Math.floor(Math.random() * 1000)
    while (UsersApi.getUsers().find(user => user.id === newUserData.id)) {
        newUserData.id = Math.floor(Math.random() * 1000)
    }

    Modal.showModal('Добавить пользователя', createModalContent(), () => {
        UsersApi.createUser(newUserData)

        const calendar = document.getElementById('calendar-body')
        const newRow = Tracker.createCalendarRow(newUserData)
        calendar.appendChild(newRow)

        const newRowScrolled = document.querySelector(`#calendar-row-user-${newUserData.id} .scrolled`)
        Tracker.scrollTo('relatives', newRowScrolled)
    })
}

function createModalContent () {
    const content = document.createElement('div')
    
    content.appendChild(
        Modal.createFormInput(
            'text',
            'Имя',
            'Имя',
            'firstname',
            '',
            (value) => newUserData.firstName = value
        )
    )

    content.appendChild(
        Modal.createFormInput(
            'text',
            'Фамилия',
            'Фамилия',
            'surname',
            '',
            (value) => newUserData.surname = value
        )
    )

    content.appendChild(
        Modal.createFormInput(
            'text',
            'Отчество',
            'Отчество',
            'secondname',
            '',
            (value) => newUserData.secondName = value
        )
    )

    content.appendChild(
        Modal.createFormInput(
            'text',
            'Никнейм',
            'Никнейм',
            'username',
            '',
            (value) => newUserData.username = value
        )
    )

    return content
}

export default {
    showModal
}