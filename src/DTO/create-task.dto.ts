import { MetaData } from '../Common/common.interfaces';

export class CreateTaskDto {
  readonly id: string;
  readonly value: string;
  readonly visible: boolean;
  readonly isDone: boolean;
  readonly created: MetaData;
  readonly deleted: MetaData;
}
