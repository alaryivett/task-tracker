const TASKS_URL = 'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/tasks'

const emptyTask = {
	id: 0,
	subject: '',
	description: '',
	creationAuthor: 0,
	executor: 0,
	creationDate: '',
	planStartDate: '',
	planEndDate: '',
	endDate: '',
	status: 0,
	order: 0
}

const TASK_STATUSES = [
	{
		id: 1,
		name: 'Не начата',
		icon: 'status-not-started.svg'
	},
	{
		id: 2,
		name: 'В процессе',
		icon: 'status-in-progress.svg'
	},
	{
		id: 3,
		name: 'Закончена',
		icon: 'status-finished.svg'
	}
]

const TASK_ORDERS = [
	{
		id: 1,
		name: 'Низкий',
		icon: 'order-low.svg'
	},
	{
		id: 2,
		name: 'Средний',
		icon: 'order-middle.svg'
	},
	{
		id: 3,
		name: 'Высокий',
		icon: 'order-high.svg'
	}
]

async function fetchTasksIfNeed () {
	if (getTasks()) {
		return
	}

	await fetchTasks()
}

function saveTasks (tasks) {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}

function getTasks () {
	return JSON.parse(localStorage.getItem('tasks'))
}

function getBacklogTasks () {
	return getTasks().filter(task => !task.executor)
}

function getTrackerTasks () {
	return getTasks().filter(task => task.executor)
}

async function fetchTasks () {
	const tasks = await fetch(TASKS_URL)
		.then(response => response.json())

	saveTasks(tasks)
}

function createTask (taskData) {
	const tasks = getTasks()
	tasks.push(taskData)

	saveTasks(tasks)
}

function updateTask (taskData) {
	const tasks = getTasks()
	const task = tasks.find(task => task.id === taskData.id)
	const taskIndex = tasks.indexOf(task)
	tasks.splice(taskIndex, 1, taskData)

	saveTasks(tasks)
}

function removeTask (taskId) {
	const tasks = getTasks()
	const task = tasks.find(task => task.id === taskId)
	const taskIndex = tasks.indexOf(task)
	tasks.splice(taskIndex, 1)

	saveTasks(tasks)
}

function getTaskStatus (statusId) {
	return TASK_STATUSES.find(status => status.id === statusId)
}

function getTaskOrder (statusId) {
	return TASK_ORDERS.find(status => status.id === statusId)
}

export default {
	TASK_STATUSES,
	TASK_ORDERS,
	emptyTask,
	fetchTasksIfNeed,
	getTasks,
	getBacklogTasks,
	getTrackerTasks,
	createTask,
	updateTask,
	removeTask,
	getTaskStatus,
	getTaskOrder
}