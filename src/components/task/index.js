import UsersApi from '../../api/users.js'
import TasksApi from '../../api/tasks.js'
import Tracker from '../tracker/index.js'
import ModalEditTask from '../modals/edit-task.js'

function createTask (taskData, type) {
	// available types: backlog, tracker
	const isBacklogTask = type === 'backlog'
	const isTrackerTask = type === 'tracker'

	let task
	if (isBacklogTask) {
		task = document.createElement('li')
		task.classList.add('task_backlog')
	} else if (isTrackerTask) {
		task = document.createElement('div')
		task.classList.add('task_tracker')
	}

	task.setAttribute('aria-label', `task-${taskData.id}`)
	
	const taskInfo = document.createElement('div')
	taskInfo.classList.add('task__info')

	const taskStatus = document.createElement('img')
	const statusIcon = TasksApi.getTaskStatus(taskData.status).icon
	taskStatus.setAttribute('src', statusIcon)
	taskStatus.setAttribute('alt', 'task-status')

	const taskOrder = document.createElement('img')
	const orderIcon = TasksApi.getTaskOrder(taskData.order).icon
	taskOrder.setAttribute('src', orderIcon)
	taskOrder.setAttribute('alt', 'task-order')

	if (isTrackerTask) {
		taskInfo.appendChild(taskStatus)
		taskInfo.appendChild(taskOrder)
	} else if (isBacklogTask) {
		const taskIcons = document.createElement('div')
		taskIcons.classList.add('task__icons')

		taskIcons.appendChild(taskStatus)
		taskIcons.appendChild(taskOrder)

		taskInfo.appendChild(taskIcons)

		const editButton = document.createElement('button')
		editButton.classList.add('task__edit-button')
		editButton.onmousedown = (event) => {
			event.stopPropagation()
		}
		editButton.addEventListener('click', () => editTask(taskData))

		const editButtonIcon = document.createElement('img')
		editButtonIcon.setAttribute('src', 'edit.svg')
		editButtonIcon.setAttribute('alt', 'edit-task')
		editButton.appendChild(editButtonIcon)

		taskInfo.appendChild(editButton)
	}

	task.appendChild(taskInfo)

	const taskName = document.createElement('span')
	taskName.classList.add('task__name')
	taskName.textContent = taskData.subject
	task.appendChild(taskName)

	const taskDescription = document.createElement('span')
	taskDescription.classList.add('task__description')
	taskDescription.textContent = taskData.description || 'Нет описания'
	task.appendChild(taskDescription)

	if (isTrackerTask) {
		task.appendChild(createTaskHint(taskData))
		task.addEventListener('click', () => editTask(taskData))
	} else if (isBacklogTask) {
		task.addEventListener('mousedown', (event) => {
			if (document.documentElement.clientWidth > 950) {
				dragTask(event, taskData)
			} else {
				editTask(taskData)
			}
		})
	}

	return task
}

function createTaskHint (taskData) {
	const taskHint = document.createElement('div')
	taskHint.classList.add('task__hint')

	const taskHintName = document.createElement('span')
	taskHintName.classList.add('task__hint-name')
	taskHintName.textContent = taskData.subject
	taskHint.appendChild(taskHintName)

	const taskHintDescription = document.createElement('span')
	taskHintDescription.classList.add('task__hint-description')
	taskHintDescription.textContent = taskData.description || 'Нет описания'
	taskHint.appendChild(taskHintDescription)

	const taskHintAuthor = document.createElement('span')
	taskHintAuthor.classList.add('task__hint-author')
	const author = UsersApi.getUser(taskData.creationAuthor)
	taskHintAuthor.textContent = 'Автор: ' + (author ? author.firstName + ' ' + author.surname : 'Не указан')
	taskHint.appendChild(taskHintAuthor)

	const taskHintCreated = document.createElement('span')
	taskHintCreated.classList.add('task__hint-created')
	taskHintCreated.textContent = 'Дата создания: ' + taskData.creationDate || 'Не указана'
	taskHint.appendChild(taskHintCreated)

	const taskHintExecutor = document.createElement('span')
	taskHintExecutor.classList.add('task__hint-executor')
	const executor = UsersApi.getUser(taskData.executor)
	taskHintExecutor.textContent = 'Исполнитель: ' + (executor ? executor.firstName + ' ' + executor.surname : 'Не указан')
	taskHint.appendChild(taskHintExecutor)

	const taskHintStart = document.createElement('span')
	taskHintStart.classList.add('task__hint-date-start')
	taskHintStart.textContent = 'Дата начала: ' + taskData.planStartDate || 'Не указана'
	taskHint.appendChild(taskHintStart)

	const taskHintEnd = document.createElement('span')
	taskHintEnd.classList.add('task__hint-date-end')
	taskHintEnd.textContent = 'Дата окончания: ' + taskData.planEndDate || 'Не указана'
	taskHint.appendChild(taskHintEnd)

	const taskHintStatus = document.createElement('span')
	taskHintStatus.classList.add('task__hint-status')
	taskHintStatus.textContent = 'Статус: ' + TasksApi.getTaskStatus(taskData.status).name
	const taskStatusIcon = document.createElement('img')
	const statusIcon = TasksApi.getTaskStatus(taskData.status).icon
	taskStatusIcon.setAttribute('src', statusIcon)
	taskStatusIcon.setAttribute('alt', 'task-status')
	taskHintStatus.appendChild(taskStatusIcon)
	taskHint.appendChild(taskHintStatus)

	const taskHintOrder = document.createElement('span')
	taskHintOrder.classList.add('task__hint-order')
	taskHintOrder.textContent = 'Приоритет: ' + TasksApi.getTaskOrder(taskData.order).name
	const taskOrderIcon = document.createElement('img')
	const orderIcon = TasksApi.getTaskOrder(taskData.order).icon
	taskOrderIcon.setAttribute('src', orderIcon)
	taskOrderIcon.setAttribute('alt', 'task-order')
	taskHintOrder.appendChild(taskOrderIcon)
	taskHint.appendChild(taskHintOrder)

	return taskHint
}

function dragTask (event, taskData) {
	const task = event.target.closest('li')

	if (event.button !== 0) {
		return
	}

	task.classList.add('task_draggable')

	document.addEventListener('mousemove', moveAt)

	task.onmouseup = (event) => {
		task.style.display = 'none'

		const calendarField = document.elementFromPoint(event.clientX, event.clientY).closest('.tracker__calendar-body-cell')
		const userField = document.elementFromPoint(event.clientX, event.clientY).closest('.tracker__user')

		if (calendarField) {
			setTaskOnCell(event, task, taskData, calendarField)

			task.style.left = 0
			task.style.top = 0
			task.removeEventListener('mousedown', dragTask)
			task.classList.remove('task_backlog')
			task.classList.add('task_tracker')
		} else if (userField) {
			setTaskOnUser(event, task, taskData, userField)
		}

		task.style.display = 'flex'
		task.classList.remove('task_draggable')

		document.removeEventListener('mousemove', moveAt)
		task.removeEventListener('mousemove', moveAt)
		task.onmouseup = null
	}

	function moveAt (event) {
		const pageX = event.pageX
		const pageY = event.pageY

		task.style.left = pageX - task.offsetWidth / 2 + 'px'
		task.style.top = pageY - task.offsetHeight / 2 + 'px'
	}
}

function editTask (taskData) {
	ModalEditTask.showModal(taskData)
}

function setTaskOnCell (task, taskData, calendarField) {
	const cellDay = calendarField.getAttribute('id').split('-')[3]
	const cellDate = `${Tracker.year}-${Tracker.month}-${cellDay}`
	if (cellDate !== taskData.planStartDate) {
		const warning = confirm('Дата начала задачи не совпадает с выбранной датой. Переназначить дату начала?')

		if (!warning) {
			return
		} else {
			const taskDuration = (new Date(taskData.planEndDate) - new Date(taskData.planStartDate)) / 1000 / 60 / 60 / 24

			taskData.planStartDate = cellDate

			const endDate = new Date(taskData.planStartDate)
			endDate.setDate(endDate.getDate() + taskDuration)
			taskData.planEndDate = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`
		}
	}

	const cellUserId = calendarField.getAttribute('id').split('-')[1]
	taskData.executor = +cellUserId

	Tracker.distributeTask(taskData)
	TasksApi.updateTask(taskData)
	document.getElementById('backlog-tasks-list').removeChild(task)
}

function setTaskOnUser (task, taskData, userField) {
	const cellUserId = userField.getAttribute('id').split('-')[1]
	taskData.executor = +cellUserId

	Tracker.distributeTask(taskData)
	TasksApi.updateTask(taskData)
	document.getElementById('backlog-tasks-list').removeChild(task)
}

export default {
	createTask
}