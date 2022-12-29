import Modal from './index.js'
import TasksApi from '../../api/tasks.js'
import UsersApi from '../../api/users.js'
import Tracker from '../tracker/index.js'
import Task from '../task/index.js'
import Backlog from '../backlog/index.js'

let newTaskData

function showModal (taskData) {
    newTaskData = taskData
    Modal.showModal('Редактировать задачу', createModalContent(taskData), () => {
        TasksApi.updateTask(newTaskData)

        const task = Array.from(document.querySelectorAll(`[aria-label='task-${newTaskData.id}']`))

        const isTrackerTask = Array.from(task[0].classList).includes('task_tracker')

        const backlogList = document.getElementById('backlog-tasks-list')

        if (newTaskData.executor) {
            task.forEach(task => task.remove())

            Tracker.distributeTask(newTaskData)
        } else if (isTrackerTask) {
            task.forEach(task => task.remove())

            if (backlogList) {
                backlogList.appendChild(Task.createTask(newTaskData, 'backlog'))
            } else {
                const emptyMessage = document.getElementById('empty-message')
                emptyMessage.remove()

                Backlog.createBacklogList([newTaskData])
            }
        } else if (!isTrackerTask) {
            backlogList.replaceChild(task[0], Task.createTask(newTaskData, 'backlog'))
        }
    })
}

function createModalContent (taskData) {
    const content = document.createElement('div')

    const optionsUsers = UsersApi.getUsers().map(user => UsersApi.getUserFullName(user.id))
    
    content.appendChild(
        Modal.createFormInput(
            'text',
            'Заголовок',
            'Заголовок задачи',
            'subject',
            taskData.subject,
            (value) => newTaskData.subject = value
        )
    )

    content.appendChild(
        Modal.createFormInput(
            'text',
            'Описание задачи',
            'Описание задачи',
            'description',
            taskData.description,
            (value) => newTaskData.description = value
        )
    )

    content.appendChild(
        Modal.createFormSelect(
            'Исполнитель',
            'executor',
            taskData.executor ? UsersApi.getUserFullName(taskData.executor) : '',
            optionsUsers,
            (value) => {
                if (value) {
                    newTaskData.executor = UsersApi.getUserByFullName(value).id
                } else {
                    newTaskData.executor = null
                }
            }
        )
    )

    content.appendChild(
        Modal.createFormInput(
            'date',
            'Дата начала',
            taskData.planStartDate,
            'start-date',
            taskData.planStartDate,
            (value) => newTaskData.planStartDate = value
        )
    )

    content.appendChild(
        Modal.createFormInput(
            'date',
            'Дата окончания',
            taskData.planEndDate,
            'end-date',
            taskData.planEndDate,
            (value) => newTaskData.planEndDate = value
        )
    )

    content.appendChild(
        Modal.createFormSelect(
            'Статус',
            'status',
            TasksApi.TASK_STATUSES.find(status => status.id === taskData.status).name,
            TasksApi.TASK_STATUSES.map(status => status.name),
            (value) => {
                if (value) {
                    newTaskData.status = TasksApi.TASK_STATUSES.find(status => status.name === value).id
                } else {
                    newTaskData.status = 1
                }
            }
        )
    )

    content.appendChild(
        Modal.createFormSelect(
            'Приоритет',
            'order',
            TasksApi.TASK_ORDERS.find(order => order.id === taskData.order).name,
            TasksApi.TASK_ORDERS.map(order => order.name),
            (value) => {
                if (value) {
                    newTaskData.order = TasksApi.TASK_ORDERS.find(order => order.name === value).id
                } else {
                    newTaskData.order = 1
                }
            }
        )
    )

    content.appendChild(
        Modal.createFormInfoMessage(
            'Автор',
            UsersApi.getUserFullName(taskData.creationAuthor)
        )
    )

    content.appendChild(
        Modal.createFormInfoMessage(
            'Дата создания',
            taskData.creationDate
        )
    )

    const removeButton = document.createElement('button')
    removeButton.setAttribute('type', 'button')
    removeButton.classList.add('modal__button')

    const buttonIcon = document.createElement('img')
    buttonIcon.setAttribute('src', 'remove.svg')
    buttonIcon.setAttribute('alt', 'remove-task')
    removeButton.appendChild(buttonIcon)

    const buttonText = document.createElement('span')
    buttonText.textContent = 'Удалить задачу'
    removeButton.appendChild(buttonText)

    removeButton.addEventListener('click', () => {
        const task = Array.from(document.querySelectorAll(`[aria-label='task-${newTaskData.id}']`))
        task.forEach(task => task.remove())

        TasksApi.removeTask(taskData)

        Modal.closeModal()
    })

    content.appendChild(removeButton)

    return content
}

export default {
    showModal
}