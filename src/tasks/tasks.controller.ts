import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {
  }

  @Get()
  async getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Promise<Task[]> {
    return await this.tasksService.getTasks(filterDto);
  }

  @Get('/:id')
  async getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return await this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async addTask(
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return await this.tasksService.addTask(createTaskDto);
  }

  @Patch('/:id')
  async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return await this.tasksService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  async removeTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.tasksService.removeTask(id);
  }
}
