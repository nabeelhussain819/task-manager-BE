const Task = require('../models/Task');
const { AppError } = require('../utils/AppError');
class TaskService {
    async getUserTasks(userId) {
        return await Task.find({ userId }).sort({ createdAt: -1 });
    }
    async createTask(userId, title, description, checklist = []) {
        const task = new Task({
            title,
            description,
            checklist,
            userId
        });
        return await task.save();
    }
    async updateTask(taskId, userId, updateData) {
        const task = await Task.findOne({ _id: taskId, userId });
        if (!task) {
            throw new AppError('Task not found', 404);
        }
        Object.assign(task, updateData);
        return await task.save();
    }
    async updateChecklistItem(taskId, userId, itemIndex, completed) {
        const task = await Task.findOne({ _id: taskId, userId });
        if (!task) {
            throw new AppError('Task not found', 404);
        }
        if (itemIndex >= task.checklist.length) {
            throw new AppError('Checklist item not found', 404);
        }
        task.checklist[itemIndex].completed = completed;
        task.markModified('checklist');
        return await task.save();
    }
    async deleteTask(taskId, userId) {
        const result = await Task.deleteOne({ _id: taskId, userId });
        if (result.deletedCount === 0) {
            throw new AppError('Task not found', 404);
        }
    }
    async getTaskById(taskId, userId) {
        const task = await Task.findOne({ _id: taskId, userId });
        if (!task) {
            throw new AppError('Task not found', 404);
        }
        return task;
    }
}
module.exports = { TaskService };
