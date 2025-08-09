const express = require("express");
const router = express.Router();
var jwt = require('jsonwebtoken');
const Task = require("../models/task.js");
const Auth =require('./auth.js')

router.get("/",Auth , async (req, res) => {
  try {
  
    const tasks = await Task.find({ userId: req.userId });

    res.json({
      status: "Success",
      tasks,
    });
  } catch (e) {
    res.status(400).json({
      status: "Failed",
      message: e.message,
      orders: []
    });
  }
});

router.post("/", Auth, async (req, res) => {
  try {
     req.body.userId = req.userId; 
    const tasks = await Task.create(req.body);
    res.status(201).json({
      status: "Success",
       message: "Task created successfully",
      tasks,
    });
  } catch (e) {
    res.status(400).json({
      status: "Failed",
      message: e.message,
    });
  }
});

router.put("/:id", Auth, async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.userId;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: userId },  
      req.body,
      { new: true }  
    );

    if (!task) {
      return res.status(404).json({
        status: "Failed",
        message: "Task not found or unauthorized",
      });
    }

    res.json({
      status: "Success",
      message: "Task updated successfully",
      task,
    });
  } catch (e) {
    res.status(400).json({
      status: "Failed",
      message: e.message,
    });
  }
});

router.delete('/:id',Auth, async (req,res)=>{
  try {
      const taskId = req.params.id;
    const userId = req.userId;
    const task=await Task.findOneAndDelete({_id:taskId,userId});
    if (!task) {
            return res.status(404).json({
                status: 'Fail',
                message: 'Task not found or not authorized',
            });
        }
        res.json({
            status: 'Success',
            message: 'Task deleted successfully',
        });
  } catch (error) {
     console.error('Error deleting task:', error);
        res.status(500).json({
            status: 'Fail',
            message: 'Server Error',
        });
  }
})
module.exports = router;