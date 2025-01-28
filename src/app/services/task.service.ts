import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks = new BehaviorSubject<Task[]>([]);
  private STORAGE_KEY = 'tasks';

  constructor(private storage: Storage) {
    this.initStorage();
  }

  // Initialise Ionic Storage
  private async initStorage(): Promise<void> {
    await this.storage.create();
    this.loadTasks();
  }

  // Charge les tâches depuis Ionic Storage
  private async loadTasks(): Promise<void> {
    const storedTasks = await this.storage.get(this.STORAGE_KEY);
    if (storedTasks) {
      this.tasks.next(storedTasks);
    }
  }

  // Sauvegarde les tâches dans Ionic Storage
  private async saveTasks(tasks: Task[]): Promise<void> {
    await this.storage.set(this.STORAGE_KEY, tasks);
    this.tasks.next(tasks);
  }

  // Renvoie les tâches sous forme d'observable
  getTasks(): Observable<Task[]> {
    return this.tasks.asObservable();
  }

  // Ajoute une nouvelle tâche
  async addTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<void> {
    const currentTasks = this.tasks.value;
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    await this.saveTasks([...currentTasks, newTask]);
  }

  // Met à jour une tâche existante
  async updateTask(task: Task): Promise<void> {
    const currentTasks = this.tasks.value;
    const index = currentTasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      currentTasks[index] = task;
      await this.saveTasks(currentTasks);
    }
  }

  // Supprime une tâche
  async deleteTask(taskId: string): Promise<void> {
    const currentTasks = this.tasks.value;
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);
    await this.saveTasks(updatedTasks);
  }

  // Renvoie les tâches de manière synchrone (depuis BehaviorSubject)
  getTasksSync(): Task[] {
    return this.tasks.getValue();
  }
}
