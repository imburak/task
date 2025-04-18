import { Controller, Get, Post } from '@nestjs/common';

@Controller("tasks")
export class TaskController {

  @Get("results")
  getResults() {
    return []
  }

  @Get("stats")
  getStats() {
    return []
  }

  @Post()
  createTask() {
    return {}
  }
}
