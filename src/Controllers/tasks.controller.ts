import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Patch,
  Query,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';

import { AuthGuard } from '../Services/auth.guard';
import { CreateTaskDto } from '../DTO/create-task.dto';
import { TasksService } from '../Services/tasks.service';
import { TaskDataClass } from 'src/Schemas/tasks.schema';

@Controller('tasks')
export class TasksController {
  constructor(private readonly TasksService: TasksService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() CreateTasksDto: CreateTaskDto, @Request() req: any) {
    return this.TasksService.create(CreateTasksDto);
  }

  @UseGuards(AuthGuard)
  @Put()
  async update(@Body() CreateTasksDto: CreateTaskDto, @Request() req: any) {
    return this.TasksService.update(CreateTasksDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Patch()
  async updateValue(
    @Body() CreateTasksDto: CreateTaskDto,
    @Request() req: any,
  ) {
    return this.TasksService.updateValue(CreateTasksDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Get()
  async findAll(): Promise<TaskDataClass[]> {
    return this.TasksService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Query('id') id: string): Promise<TaskDataClass> {
    return this.TasksService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Delete()
  async delete(@Query('id') id: string) {
    return this.TasksService.delete(id);
  }
}
