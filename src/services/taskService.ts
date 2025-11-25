const Task = require('../models/Task');
const { AppError } = require('../utils/AppError');

class TaskService {
  async getUserTasks(userId: string): Promise<any[]> {
    return await Task.find({ userId }).sort({ createdAt: -1 });
  }

  async createTask(
    userId: string,
    title: string,
    description?: string,
    checklist: any[] = []
  ): Promise<any> {
    const task = new Task({
      title,
      description,
      checklist,
      userId
    });

    return await task.save();
  }

  async updateTask(
    taskId: string,
    userId: string,
    updateData: Partial<any>
  ): Promise<any> {
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    Object.assign(task, updateData);
    return await task.save();
  }

  async updateChecklistItem(
    taskId: string,
    userId: string,
    itemIndex: number,
    completed: boolean
  ): Promise<any> {
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

  async deleteTask(taskId: string, userId: string): Promise<void> {
    const result = await Task.deleteOne({ _id: taskId, userId });
    if (result.deletedCount === 0) {
      throw new AppError('Task not found', 404);
    }
  }

  async getTaskById(taskId: string, userId: string): Promise<any> {
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      throw new AppError('Task not found', 404);
    }
    return task;
  }
}

module.exports = { TaskService };