import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskDetailModalPage } from '../task-detail-modal/task-detail-modal.page';
import { ModalController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: false,
})
export class TasksPage implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedCategory: string = 'all';
  searchTerm: string = '';

  constructor(private taskService: TaskService, private modalController: ModalController) {
    this.listenAppState();
  }

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.filterTasks();
    });
  }

  async openTaskDetailModal(taskId: string) {
    const modal = await this.modalController.create({
      component: TaskDetailModalPage,
      componentProps: {
        taskId: taskId,
      },
    });
    return await modal.present();
  }

  sortTasksByDate() {
    this.filteredTasks = this.filteredTasks.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA.getTime() - dateB.getTime();
    });
  }

  // Méthode pour filtrer les tâches en fonction de la catégorie et de la recherche par titre
  filterTasks() {
    let filtered = this.tasks;

    switch (this.selectedCategory) {
      case 'todo':
        filtered = filtered.filter(task => task.status === 'À faire');
        break;
      case 'inProgress':
        filtered = filtered.filter(task => task.status === 'En cours');
        break;
      case 'completed':
        filtered = filtered.filter(task => task.status === 'Terminé');
        break;
      case 'all':
      default:
        break;
    }

    if (this.searchTerm.trim()) {
      filtered = filtered.filter(task => task.title.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    this.filteredTasks = filtered;
    this.sortTasksByDate();
  }

  getBadgeColor(status: string): string {
    switch (status) {
      case 'À faire':
        return 'danger';
      case 'En cours':
        return 'warning';
      case 'Terminé':
        return 'success';
      default:
        return 'medium';
    }
  }

  // Compter le nombre de tâches par statut
  countTasksByStatus(status: string): number {
    return this.tasks.filter(task => task.status === status).length;
  }
  
  listenAppState() {
    App.addListener('appStateChange', (state) => {
      if (!state.isActive) {
        this.sendNotificationOnExit();
      }
    });
  }

  async sendNotificationOnExit() {
    const hasCompletedTask = this.tasks.some(task => task.status === 'Terminé');

    const notificationMessage = hasCompletedTask 
      ? 'Vous avez une tâche terminée !' 
      : 'Vous n\'avez pas de tâches terminées.';

    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1,
          title: 'Rappel de tâche',
          body: notificationMessage,
          schedule: { at: new Date(new Date().getTime() + 1000) },
          sound: 'default',
        },
      ],
    });
  }
}
