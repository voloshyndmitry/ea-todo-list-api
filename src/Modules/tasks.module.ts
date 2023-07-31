import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksController } from '../Controllers/tasks.controller';
import { TaskDataClass, TaskSchema } from '../Schemas/tasks.schema';
import { TasksService } from '../Services/tasks.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TaskDataClass.name, schema: TaskSchema },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
