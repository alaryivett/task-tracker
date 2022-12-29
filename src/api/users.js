const USERS_URL = 'https://varankin_dev.elma365.ru/api/extensions/2a38760e-083a-4dd0-aebc-78b570bfd3c7/script/users'

const emptyUser = {
	id: 0,
	username: '',
	surname: '',
	firstName: '',
	secondName: ''
}

async function fetchUsersIfNeed () {
	if (getUsers()) {
		return
	}

	await fetchUsers()
}

function saveUsers (users) {
	localStorage.setItem('users', JSON.stringify(users))
}

function getUsers () {
	return JSON.parse(localStorage.getItem('users'))
}

function getUser (userId) {
	return getUsers().find(user => user.id === userId)
}

function getUserFullName (userId) {
	const user = getUser(userId)

	return user.firstName + ' ' + user.surname
}

function getUserByFullName (userFullName) {
	return getUsers().find((user) => getUserFullName(user.id) === userFullName)
}

async function fetchUsers () {
	const users = await fetch(USERS_URL)
		.then(response => response.json())

	saveUsers(users)
}

function createUser (userData) {
	const users = getUsers()
	users.push(userData)

	saveUsers(users)
}

function updateUser (userData) {
	const users = getUsers()
	const user = users.find(user => user.id === userData.id)
	const userIndex = users.indexOf(user)
	users.splice(userIndex, 1, userData)

	saveUsers(users)
}

function removeUser (userId) {
	const users = getUsers()
	const user = users.find(user => user.id === userId)
	const userIndex = users.indexOf(user)
	users.splice(userIndex, 1)

	saveUsers(users)
}

export default {
	emptyUser,
	fetchUsersIfNeed,
	getUsers,
	getUser,
	getUserFullName,
	getUserByFullName,
	createUser,
	updateUser,
	removeUser
}