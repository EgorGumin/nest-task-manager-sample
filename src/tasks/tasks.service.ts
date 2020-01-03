import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTasks(): Task[] {
    return this.tasks;
  }

  getFilteredTasks(filterDto: GetTasksFilterDto): Task[] {
    const { status, q } = filterDto;
    let tasks = this.tasks;

    if (status) {
      tasks = this.tasks.filter(task => task.status === status);
    }

    if (q) {
      tasks = this.tasks.filter(task => {
        return task.title.includes(q) || task.description.includes(q);
      });
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const task: Task = this.tasks.find((currentTask: Task) => currentTask.id === id);

    if (task) {
      return task;
    } else {
      throw new NotFoundException(`Can't find task with id "${id}"`);
    }
  }

  addTask(createTaskDto: CreateTaskDto): Task {
    const {
      title,
      description,
    } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  removeTask(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    if (task) {
      task.status = status;
    }
    return task;
  }
}
