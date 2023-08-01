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

  async create(createTaskDto): Promise<boolean> {
    const id = `event${generateId()}`;
    const created = {
      date: new Date().getTime(),
    };
    try {
      const createdTask = new this.TasksModel({
        ...createTaskDto,
        id,
        created,
        visible: true,
        isDone: false,
      });

      await createdTask.save();
      console.log('create done');
      return true;
    } catch {
      console.log('create fail');
      return false;
    }
  }

  async hideAll(): Promise<undefined> {
    await this.TasksModel.updateMany({ visible: true }, { visible: false });
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

  async findAll(): Promise<TaskDataClass[]> {
    const Tasks = await this.TasksModel.find().exec();

    return Tasks.map((Task) => {
      const { _id, ...TaskData } = Task.toObject();
      return TaskData;
    });
  }

  async getTasksByName(name: string): Promise<TaskDataClass> {
    return this.TasksModel.findOne({
      value: { $regex: name, $options: 'i' },
    }).exec();
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
