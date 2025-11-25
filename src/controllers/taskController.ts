const { TaskService } = require('../services/taskService');
const { asyncHandler } = require('../utils/asyncHandler');

const taskService = new TaskService();

const getTasks = asyncHandler(async (req: any, res: any) => {
  const tasks = await taskService.getUserTasks(req.user.userId);
  res.json(tasks);
});

const createTask = asyncHandler(async (req: any, res: any) => {
  const { title, description, checklist } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const task = await taskService.createTask(
    req.user.userId,
    title,
    description,
    checklist
  );

  res.status(201).json(task);
});

const updateTask = asyncHandler(async (req: any, res: any) => {
  const task = await taskService.updateTask(
    req.params.id,
    req.user.userId,
    req.body
  );

  res.json(task);
});

const updateChecklistItem = asyncHandler(async (req: any, res: any) => {
  const { taskId, itemIndex } = req.params;
  const { completed } = req.body;

  const task = await taskService.updateChecklistItem(
    taskId,
    req.user.userId,
    parseInt(itemIndex),
    completed
  );

  res.json(task);
});

const deleteTask = asyncHandler(async (req: any, res: any) => {
  await taskService.deleteTask(req.params.id, req.user.userId);
  res.json({ message: 'Task deleted successfully' });
});

const getTask = asyncHandler(async (req: any, res: any) => {
  const task = await taskService.getTaskById(req.params.id, req.user.userId);
  res.json(task);
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  updateChecklistItem,
  deleteTask,
  getTask
};