import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TaskService } from '../services/task.service';

@Injectable({
  providedIn: 'root',
})
export class TaskGuard implements CanActivate {
  constructor(private taskService: TaskService, private router: Router) {}

  canActivate(): boolean {
    // Vérifie s'il y a des tâches disponibles
    if (this.taskService.getTasksSync().length > 0) {
      return true;
    } else {
      this.router.navigate(['/no-tasks']);
      return false;
    }
  }
}
