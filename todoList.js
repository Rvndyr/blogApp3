// grab db
const low = require('lowdb');
// instantiate db
const db = low('./db.json');

// default
db.defaults({ todos: [] }).write();

const TodoList = {};

/*
	@func getItems
	@desc gets all todos
*/
TodoList.getItems = () => {
	return db.get('todos').value();
}

/*
	@func createItem
	@desc creates a new todo
*/

TodoList.createItem = (itemToCreate) => {
	db.get('todos').push({
		id: Date.now(),
		data: itemToCreate,
	}).write();
}

/*

*/
TodoList.updateItem = (id, key, propertyToUpdate) => {
	db.get('todos')
		  .find({ id })
		  .set(key, propertyToUpdate)
		  .write()
}

TodoList.deleteItem = (id) => {
	db.get('todos')
		.remove({id})
		.write();
}

module.exports = TodoList;
