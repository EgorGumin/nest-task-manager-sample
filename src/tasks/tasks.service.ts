import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status';

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {
  }

  async getTaskById(id: number): Promise<Task> {
    const task: Task = await this.taskRepository.findOne(id);

    if (task) {
      return task;
    } else {
      throw new NotFoundException(`Can't find task with id "${id}"`);
    }
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return await this.taskRepository.getTask(filterDto);
  }

  async addTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.createTask(createTaskDto);
  }

  async removeTask(id: number): Promise<void> {
    const task = await this.getTaskById(id);

    if (task) {
      await this.taskRepository.remove(task);
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }
}
