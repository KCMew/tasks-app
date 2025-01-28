import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskStatus } from 'src/app/models/status.enum';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks = new BehaviorSubject<Task[]>([]);
  private STORAGE_KEY = 'tasks';

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    const storedTasks = localStorage.getItem(this.STORAGE_KEY);
    if (storedTasks) {
      this.tasks.next(JSON.parse(storedTasks));
    }
  }

  private saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    this.tasks.next(tasks);
  }

  getTasks(): Observable<Task[]> {
    return this.tasks.asObservable();
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'>): void {
    const currentTasks = this.tasks.value;
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    this.saveTasks([...currentTasks, newTask]);
  }

  updateTask(task: Task): void {
    const currentTasks = this.tasks.value;
    const index = currentTasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      currentTasks[index] = task;
      this.saveTasks(currentTasks);
    }
  }

  deleteTask(taskId: string): void {
    const currentTasks = this.tasks.value;
    this.saveTasks(currentTasks.filter(task => task.id !== taskId));
  }

  getTasksSync(): Task[] {
    return this.tasks.getValue();
  }
} 