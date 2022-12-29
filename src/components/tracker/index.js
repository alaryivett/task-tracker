import Task from '../task/index.js'
import UsersApi from '../../api/users.js'
import TasksApi from '../../api/tasks.js'
import ModalEditUser from '../modals/edit-user.js'

const today = new Date()
let year = today.getFullYear()
let month = today.getMonth() + 1
let columns = []

const weekdays = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб']
const months = ['ЯНВАРЬ', 'ФЕВРАЛЬ', 'МАРТ', 'АПРЕЛЬ', 'МАЙ', 'ИЮНЬ', 'ИЮЛЬ', 'АВГУСТ', 'СЕНТЯБРЬ', 'ОКТЯБРЬ', 'НОЯБРЬ', 'ДЕКАБРЬ']

const previousMonth = document.getElementById('button-back')
previousMonth.addEventListener('click', () => {
	setPreviousMonth()
})
const nextMonth = document.getElementById('button-next')
nextMonth.addEventListener('click', () => {
	setNextMonth()
})

function createTracker (users, tasks) {
	prepareColumns()
	updateTrackerHeader()
	createCalendar(users)
	tasks.forEach((task) => { distributeTask(task) })

	if (today.getFullYear() === year && today.getMonth() + 1 === month) {
		scrollTo('today')
	} else {
		scrollTo('start')
	}
}

function prepareColumns () {
	const date = new Date(`${year}-${month}-01`)
	const daysInMonth = 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate()

	for (let day = 1; day <= daysInMonth; day++) {
		const currentDate = new Date(`${year}-${month}-${day}`)
		columns.push({
			day: day,
			weekday: weekdays[currentDate.getDay()]
		})
	}
}

function updateTrackerHeader () {
	document.getElementById('month').textContent = months[month - 1]
	document.getElementById('year').textContent = year
	document.querySelector('#button-back span').textContent = months[month - 2] || months[11]
	document.querySelector('#button-next span').textContent = months[month] || months[0]
}

function createCalendarHeader () {
	const trackerHeader = document.getElementById('calendar-header')

	columns.forEach((column) => {
		const trackerColumn = document.createElement('div')
		trackerColumn.setAttribute('id', 'tracker-header-cell-' + column.day)
		trackerColumn.classList.add('tracker__calendar-header-cell')
		if (year === today.getFullYear() && month === today.getMonth() + 1 && today.getDate() === column.day) {
			trackerColumn.classList.add('today')
		}

		const trackerColumnDay = document.createElement('div')
		trackerColumnDay.textContent = column.day
		trackerColumn.appendChild(trackerColumnDay)

		const trackerColumnWeekday = document.createElement('div')
		trackerColumnWeekday.textContent = column.weekday
		trackerColumn.appendChild(trackerColumnWeekday)

		trackerHeader.appendChild(trackerColumn)
	})
}

function createUser (user) {
	const trackerUser = document.createElement('div')
	trackerUser.classList.add('tracker__user')
	trackerUser.setAttribute('id', 'user-' + user.id)

	const trackerUserName = document.createElement('span')
	trackerUserName.textContent = user.firstName + ' ' + user.surname

	trackerUser.appendChild(trackerUserName)

	trackerUser.addEventListener('click', () => ModalEditUser.showModal(user))

	return trackerUser
}

function createCalendarRow (user) {
	const calendarRow = document.createElement('div')
	calendarRow.classList.add('tracker__calendar-row')
	calendarRow.setAttribute('id', `calendar-row-user-${user.id}`)

	calendarRow.appendChild(createUser(user))

	const wrapper = document.createElement('div')
	wrapper.classList.add('scrolled')
	calendarRow.appendChild(wrapper)

	const trackerRowBody = document.createElement('div')
	trackerRowBody.classList.add('tracker__calendar-row-body')
	trackerRowBody.setAttribute('id', 'row-user-' + user.id)
	wrapper.appendChild(trackerRowBody)
	addMassHorizontalScroll(wrapper)

	columns.forEach((column) => {
		const calendarCell = document.createElement('div')
		calendarCell.classList.add('tracker__calendar-body-cell')
		calendarCell.setAttribute('id', `user-${user.id}-day-${column.day}`)
		trackerRowBody.appendChild(calendarCell)
	})

	return calendarRow
}

function distributeTask (task) {
	const taskStart = new Date(task.planStartDate)
	const taskEnd = new Date(task.planEndDate)

	let taskDurationDays = []
	taskDurationDays.push(`${taskStart.getFullYear()}-${taskStart.getMonth() + 1}-${taskStart.getDate()}`)
	while (!compareDates(taskStart, taskEnd)) {
		taskStart.setDate(taskStart.getDate() + 1)
		taskDurationDays.push(`${taskStart.getFullYear()}-${taskStart.getMonth() + 1}-${taskStart.getDate()}`)
	}
	
	taskDurationDays.forEach((day) => {
		const date = new Date(day)

		if (date.getFullYear() === year && date.getMonth() + 1 === month && task.executor) {

			document.getElementById(`user-${task.executor}-day-${date.getDate()}`).appendChild(Task.createTask(task, 'tracker'))
		}
	})
}

function createCalendar (users) {
	createCalendarHeader()
	users.forEach((user) => {
		const calendarBody = document.getElementById('calendar-body')
		calendarBody.appendChild(createCalendarRow(user))
	})
}

function updateTracker (users, tasks) {
	columns = []
	const calendarHeader = document.getElementById('calendar-header')
	while (calendarHeader.firstChild) {
		calendarHeader.removeChild(calendarHeader.firstChild)
	}

	const calendarBody = document.getElementById('calendar-body')
	while (calendarBody.firstChild) {
		calendarBody.removeChild(calendarBody.firstChild)
	}

	createTracker(UsersApi.getUsers(), TasksApi.getTrackerTasks())
}

function setPreviousMonth () {
	if (month === 1) {
		month = 12
		year -= 1 
	} else {
		month -= 1
	}

	updateTracker(UsersApi.getUsers(), TasksApi.getTrackerTasks())
}

function setNextMonth () {
	if (month === 12) {
		month = 1
		year += 1 
	} else {
		month += 1
	}

	updateTracker(UsersApi.getUsers(), TasksApi.getTrackerTasks())
}

function scrollTo (to, element) {
	if (to === 'today') {
		const wrapperX = document.querySelector('.scrolled').getBoundingClientRect().x
		const todayCellX = document.getElementById('tracker-header-cell-' + today.getDate()).getBoundingClientRect().x
		document.querySelectorAll('.scrolled').forEach(scrollElement => scrollElement.scrollLeft = todayCellX - wrapperX)
	} else if (to === 'start') {
		document.querySelectorAll(`.scrolled`).forEach(scrollElement => scrollElement.scrollLeft = 0)
	} else if (to === 'relatives') {
		const calendarHeaderScroll = document.getElementById('calendar-header').scrollLeft
		element.scrollLeft = calendarHeaderScroll
	}
}


function addMassHorizontalScroll (element) {
	if (element.addEventListener) {
		// IE9, Chrome, Safari, Opera
		element.addEventListener("mousewheel", scrollHorizontally, false);
		// Firefox
		element.addEventListener("DOMMouseScroll", scrollHorizontally, false);
	} else {
		// IE 6/7/8
		element.attachEvent("onmousewheel", scrollHorizontally);
	}

	function scrollHorizontally(e) {
		e = window.event || e
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)))
		document.querySelectorAll('.scrolled').forEach(scrollElement => scrollElement.scrollLeft -= (delta*50))
		e.preventDefault()
	}
}

function compareDates(firstDate, secondDate) {
	return firstDate.getDate() === secondDate.getDate() && firstDate.getMonth() === secondDate.getMonth() && firstDate.getFullYear() === secondDate.getFullYear()
}


export default {
	createTracker,
	year,
	month,
	createUser,
	createCalendarRow,
	updateTracker,
	setPreviousMonth,
	setNextMonth,
	distributeTask,
	scrollTo
}