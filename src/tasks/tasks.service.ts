import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
  private tasks = [];

  getTasks() {
    return this.tasks;
  }
}
