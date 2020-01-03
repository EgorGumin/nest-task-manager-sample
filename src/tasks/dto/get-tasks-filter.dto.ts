import { TaskStatus } from '../task.model';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetTasksFilterDto {
  @IsOptional()
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  q: string;
}
