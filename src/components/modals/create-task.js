import Modal from './index.js'
import TasksApi from '../../api/tasks.js'
import UsersApi from '../../api/users.js'
import Tracker from '../tracker/index.js'
import Task from '../task/index.js'
import Backlog from '../backlog/index.js'

let newTaskData = TasksApi.emptyTask

function showModal () {
    newTaskData.id = Math.floor(Math.random() * 1000)
    while (TasksApi.getTasks().find(task => task.id === newTaskData.id)) {
        newTaskData.id = Math.floor(Math.random() * 1000)
    }

    const today = new Date()
    const creationDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
    newTaskData.creationDate = creationDate

    Modal.showModal('Добавить задачу', createModalContent(), () => {
        TasksApi.createTask(newTaskData)

        const backlogList = document.getElementById('backlog-tasks-list')

        if (newTaskData.executor) {
            Tracker.distributeTask(newTaskData)
        } else {
            if (backlogList) {
                backlogList.appendChild(Task.createTask(newTaskData, 'backlog'))
            } else {
                Backlog.createBacklogList([newTaskData])
            }
        }
    })
}

function createModalContent () {
    const content = document.createElement('div')

    const optionsUsers = UsersApi.getUsers().map(user => UsersApi.getUserFullName(user.id))
    
    content.appendChild(
        Modal.createFormInput(
            'text',
            'Заголовок',
            'Заголовок задачи',
            'subject',
            '',
            (value) => newTaskData.subject = value
        )
    )

    content.appendChild(
        Modal.createFormInput(
            'text',
            'Описание задачи',
            'Описание задачи',
            'description',
            '',
            (value) => newTaskData.description = value
        )
    )

    content.appendChild(
        Modal.createFormSelect(
            'Исполнитель',
            'executor',
            '',
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
            '',
            'start-date',
            '',
            (value) => newTaskData.planStartDate = value
        )
    )

    content.appendChild(
        Modal.createFormInput(
            'date',
            'Дата окончания',
            '',
            'end-date',
            '',
            (value) => newTaskData.planEndDate = value
        )
    )

    content.appendChild(
        Modal.createFormSelect(
            'Статус',
            'status',
            '',
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
            '',
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
        Modal.createFormSelect(
            'Автор',
            'author',
            '',
            optionsUsers,
            (value) => {
                if (value) {
                    newTaskData.creationAuthor = UsersApi.getUserByFullName(value).id
                } else {
                    newTaskData.creationAuthor = null
                }
            }
        )
    )

    const today = new Date()
    content.appendChild(
        Modal.createFormInfoMessage(
            'Дата создания',
            `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
        )
    )

    return content
}

export default {
    showModal
}