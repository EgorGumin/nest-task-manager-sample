import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task.model';

export class TaskStatusValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {

    if (TaskStatus[value]) {
      return value;
    } else {
      throw new BadRequestException(`Invalid status "${value}"`);
    }
  }
}
