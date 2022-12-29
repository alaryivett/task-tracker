import Tracker from '../components/tracker/index.js'
import Backlog from '../components/backlog/index.js'
import Loader from '../components/loader/index.js'
import ModalCreateTask from '../components/modals/create-task.js'
import ModalCreateUser from '../components/modals/create-user.js'
import TasksApi from '../api/tasks.js'
import UsersApi from '../api/users.js'

Loader.showLoading(async () => {
	await TasksApi.fetchTasksIfNeed()
	await UsersApi.fetchUsersIfNeed()

	const buttonAddTask = document.getElementById('button-add-task')
	buttonAddTask.addEventListener('click', ModalCreateTask.showModal)
	const buttonAddUser = document.getElementById('button-add-user')
	buttonAddUser.addEventListener('click', ModalCreateUser.showModal)

	Backlog.createBacklogList(TasksApi.getBacklogTasks())
	Tracker.createTracker(UsersApi.getUsers(), TasksApi.getTrackerTasks())
})