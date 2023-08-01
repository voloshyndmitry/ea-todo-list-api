import {
  MessageBody,
  SubscribeMessage,
  WebSocketServer,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { CreateTaskDto } from 'src/DTO/create-task.dto';
import { TasksService } from '../Services/tasks.service';
@WebSocketGateway()
export class TasksGateWay implements OnModuleInit {
  @WebSocketServer()
  server: Server;
  constructor(private readonly TasksService: TasksService) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('connected');
    });
  }

  @SubscribeMessage('addNewTask')
  async onUpdateList(@MessageBody() body: CreateTaskDto) {
    await this.TasksService.create(body);
    this.updateAllLists();
  }

  @SubscribeMessage('deleteAll')
  async deleteAll(@MessageBody() body: CreateTaskDto) {
    await this.TasksService.hideAll();
    this.updateAllLists();
  }

  @SubscribeMessage('filterByName')
  async filterByName(@MessageBody() body: string) {
    if (!body) {
      this.updateAllLists();
    }
    const data = await this.TasksService.getTasksByName(body);

    const todoList = data.filter(({ isDone, visible }) => !isDone && visible);
    const doneList = data
      .filter(({ isDone, visible }) => isDone && visible)
      .sort((a, b) => Number(b?.updated?.date) - Number(a?.updated?.date));

    if (doneList.length > 10) {
      doneList.length = 10;
    }

    this.server.emit('updateTodoLists', {
      msg: 'updateLists',
      content: { data: todoList },
    });

    this.server.emit('updateDoneLists', {
      msg: 'updateLists',
      content: { data: doneList },
    });
  }

  @SubscribeMessage('taskUpdate')
  async taskUpdate(@MessageBody() body: CreateTaskDto) {
    const data = await this.TasksService.update(body);
    this.updateAllLists();
  }

  @SubscribeMessage('init')
  async init(@MessageBody() body: string) {
    this.updateAllLists();
  }

  private async updateAllLists() {
    const allTasks = await this.TasksService.findAll();
    const todoList = allTasks.filter(
      ({ isDone, visible }) => !isDone && visible,
    );
    const doneList = allTasks
      .filter(({ isDone, visible }) => isDone && visible)
      .sort((a, b) => Number(b?.updated?.date) - Number(a?.updated?.date));

    if (doneList.length > 10) {
      doneList.length = 10;
    }

    this.server.emit('updateTodoLists', {
      msg: 'updateLists',
      content: { data: todoList },
    });

    this.server.emit('updateDoneLists', {
      msg: 'updateLists',
      content: { data: doneList },
    });
  }
}
