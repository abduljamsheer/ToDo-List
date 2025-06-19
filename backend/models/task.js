const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", 
    required: true
  },
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	priority: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	dueDate: {
		type: String,
		required: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
