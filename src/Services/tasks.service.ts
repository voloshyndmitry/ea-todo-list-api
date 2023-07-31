import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaskDataClass } from '../Schemas/tasks.schema';
import { CreateTaskDto } from '../DTO/create-task.dto';

const hyperid = require('hyperid');
const generateId = hyperid({ urlSafe: true });
@Injectable()
export class TasksService {
  constructor(
    @InjectModel(TaskDataClass.name)
    private TasksModel: Model<TaskDataClass>,
  ) {}

  async create(createTaskDto, user): Promise<boolean> {
    const id = `event${generateId()}`;
    const created = {
      date: new Date().getTime(),
      userId: user.sub,
    };
    try {
      const createdTask = new this.TasksModel({
        ...createTaskDto,
        id,
        created,
      });

      await createdTask.save();

      return true;
    } catch {
      return false;
    }
  }

  async update(createTaskDto: CreateTaskDto, user): Promise<TaskDataClass> {
    const { id, ...updateData } = createTaskDto;
    const updated = {
      date: new Date().getTime(),
      userId: user.sub,
    };
    const resp = await this.TasksModel.findOneAndUpdate(
      { id },
      { ...updateData, updated },
      {
        new: true,
      },
    );

    return resp;
  }

  async updateValue(
    createTaskDto: CreateTaskDto,
    user,
  ): Promise<TaskDataClass> {
    const { id, ...updateData } = createTaskDto;
    const updated = {
      date: new Date().getTime(),
      userId: user.sub,
    };
    const Task = await this.findOne(id);

    const resp = await this.TasksModel.findOneAndUpdate(
      { id },
      { ...Task, ...updateData, updated },
    );

    return resp;
  }

  async findAll(user): Promise<TaskDataClass[]> {
    const Tasks = await this.TasksModel.find().exec();

    return Tasks.map((Task) => {
      const { _id, ...TaskData } = Task.toObject();
      return TaskData;
    });
  }

  async findOne(id: string): Promise<TaskDataClass> {
    return this.TasksModel.findOne({ id: id }).exec();
  }

  async delete(id: string) {
    const deletedCat = await this.TasksModel.findOneAndRemove({
      id,
    }).exec();
    return deletedCat;
  }
}
