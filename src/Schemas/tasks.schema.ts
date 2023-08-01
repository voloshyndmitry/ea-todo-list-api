import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MetaData } from 'src/Common/common.interfaces';
import { MetaDataSchema } from 'src/Common/common.schema';

export type TasksDocument = HydratedDocument<TaskDataClass>;

@Schema({ collection: 'Tasks' })
export class TaskDataClass {
  @Prop({ required: true, type: String })
  id: string;

  @Prop({ required: true, type: String })
  value: string;

  @Prop({ required: true, type: Boolean })
  visible: boolean;

  @Prop({ type: Boolean })
  isDone: boolean;

  @Prop({ required: true, type: MetaDataSchema })
  created: MetaData;

  @Prop({ type: MetaDataSchema })
  updated: MetaData;
}

export const TaskSchema = SchemaFactory.createForClass(TaskDataClass);
