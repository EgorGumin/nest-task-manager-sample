import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {
  }

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Task[] {
    if (Object.keys(filterDto).length > 0) {
      return this.tasksService.getFilteredTasks(filterDto);
    } else {
      return this.tasksService.getTasks();
    }
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  addTask(
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.tasksService.addTask(createTaskDto);
  }

  @Patch('/:id')
  updateTask(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Task {
    return this.tasksService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  removeTask(@Param('id') id: string): void {
    this.tasksService.removeTask(id);
  }
}
