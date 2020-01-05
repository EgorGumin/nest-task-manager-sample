import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../auth/user.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTaskById(id: number, user: User): Promise<Task> {
    const queryBuilder = this.createQueryBuilder('task');

    queryBuilder.where({ user: { id: user.id } });
    queryBuilder.andWhere('task.id = :id', { id });
    const task = await queryBuilder.getOne();
    if (!task) {
      throw new NotFoundException(`Task with id "${id}" was not found`);
    }
    return task;
  }

  async getTask(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, q } = filterDto;
    const queryBuilder = this.createQueryBuilder('task');

    queryBuilder.where({ user: { id: user.id } });

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    if (q) {
      queryBuilder.andWhere(
        'task.title LIKE :q OR task.description LIKE :q',
        { q: `%${q}%` },
      );
    }

    const tasks = await queryBuilder.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const {
      title,
      description,
    } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.user = user;
    task.status = TaskStatus.OPEN;
    await task.save();

    delete task.user;
    return task;
  }
}
