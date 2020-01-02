import { Body, Controller, Get, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {
  }

  @Get()
  getAllTasks(): Task[] {
    return this.tasksService.getTasks();
  }

  @Post()
  addTask(
    @Body('title') title: string,
    @Body('description') description: string,
  ) {
    return this.tasksService.addTask(title, description);
  }
}
