import Task from '../task/index.js'
import TasksApi from '../../api/tasks.js'

function createBacklogList (tasksData) {
    const backlog = document.getElementById('backlog')

    const backlogList = document.createElement('ul')
    backlogList.setAttribute('id', 'backlog-tasks-list')
	backlogList.classList.add('backlog__tasks-list')
	backlog.appendChild(backlogList)

    tasksData.forEach((task) => {
        backlogList.appendChild(Task.createTask(task, 'backlog'))
    })

    const toggleBacklogButton = document.getElementById('toggle-backlog-button')
    toggleBacklogButton.addEventListener('click', () => {
        const isHidden = Array.from(backlog.classList).find(className => className === 'hidden')

        if (isHidden) {
            backlog.classList.remove('hidden')
            toggleBacklogButton.textContent = 'Скрыть бэклог'
        } else {
            backlog.classList.add('hidden')
            toggleBacklogButton.textContent = 'Показать бэклог'
        }
    })
}

function createEmptyMessage (text) {
    const emptyMessage = document.createElement('p')
    emptyMessage.classList.add('backlog__empty-message')
    emptyMessage.setAttribute('id', 'empty-message')
    emptyMessage.textContent = text

    return emptyMessage
}

function updateBacklogList (newTasksData) {
    const backlog = document.getElementById('backlog')
    const backlogList = document.getElementById('backlog-tasks-list')

    if (newTasksData.length) {
        if (!backlogList) {
            const emptyMessage = document.getElementById('empty-message')
            backlog.removeChild(emptyMessage)
            createBacklogList(newTasksData)
            return
        }

        while (backlogList.firstChild) {
            backlogList.removeChild(backlogList.firstChild)
        }

        newTasksData.forEach(task => backlogList.appendChild(Task.createTask(task, 'backlog')))
        
    } else {
        if (!backlogList) {
            return
        }

        backlog.removeChild(backlogList)

        backlog.appendChild(createEmptyMessage('Задачи не найдены'))
    }
}

const backlogSearch = document.getElementById('backlog-search')
backlogSearch.addEventListener('keyup', () => {
    const inputValue = backlogSearch.value.toLowerCase()
    const prepareTask = task => [task.subject, task.description].join('').toLocaleLowerCase()

    const filteredTasks = TasksApi.getBacklogTasks().filter(task => prepareTask(task).includes(inputValue))

    updateBacklogList(filteredTasks)
})

export default {
    createBacklogList
}