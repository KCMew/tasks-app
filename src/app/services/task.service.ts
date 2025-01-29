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
    try {
      await this.storage.create();
      await this.loadTasks();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du stockage:', error);
    }
  }

  // Charge les tâches depuis Ionic Storage
  private async loadTasks(): Promise<void> {
    try {
      const storedTasks = await this.storage.get(this.STORAGE_KEY);
      if (storedTasks) {
        this.tasks.next(storedTasks);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tâches depuis le stockage:', error);
      this.tasks.next([]);
    }
  }

  // Sauvegarde les tâches dans Ionic Storage
  private async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await this.storage.set(this.STORAGE_KEY, tasks);
      this.tasks.next(tasks);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des tâches dans le stockage:', error);
    }
  }

  // Renvoie les tâches sous forme d'observable
  getTasks(): Observable<Task[]> {
    return this.tasks.asObservable();
  }

  // Ajoute une nouvelle tâche
  async addTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<void> {
    try {
      const currentTasks = this.tasks.value;
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      await this.saveTasks([...currentTasks, newTask]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'une tâche:', error);
    }
  }

  // Met à jour une tâche existante
  async updateTask(task: Task): Promise<void> {
    try {
      const currentTasks = this.tasks.value;
      const index = currentTasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        currentTasks[index] = task;
        await this.saveTasks(currentTasks);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
    }
  }

  // Supprime une tâche
  async deleteTask(taskId: string): Promise<void> {
    try {
      const currentTasks = this.tasks.value;
      const updatedTasks = currentTasks.filter(task => task.id !== taskId);
      await this.saveTasks(updatedTasks);
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
    }
  }

  // Renvoie les tâches de manière synchrone (depuis BehaviorSubject)
  getTasksSync(): Task[] {
    return this.tasks.getValue();
  }
}
