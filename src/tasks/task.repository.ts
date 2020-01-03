import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTask(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, q } = filterDto;
    const queryBuilder = this.createQueryBuilder('task');

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

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const {
      title,
      description,
    } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();
    return task;
  }
}
