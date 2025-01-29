import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { TaskStatus } from 'src/app/models/status.enum';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-task-detail-modal',
  templateUrl: './task-detail-modal.page.html',
  styleUrls: ['./task-detail-modal.page.scss'],
  standalone: false
})
export class TaskDetailModalPage implements OnInit {
  @Input() taskId: string | null = null;
  taskForm: FormGroup;
  taskStatuses = Object.values(TaskStatus);

  constructor(
    private modalController: ModalController,
    private fb: FormBuilder,
    private taskService: TaskService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: [TaskStatus.TODO, Validators.required],
      dueDate: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.taskId) {
      this.loadTask(this.taskId);
    }
  }

  // Charge les tâches existantes
  loadTask(id: string) {
    this.taskService.getTasks().subscribe(tasks => {
      const task = tasks.find(t => t.id === id);
      if (task) {
        this.taskForm.patchValue(task);
      }
    });
  }

  async onSubmit() {
    if (this.taskForm.valid && this.taskId) {
      const updatedTask: Task = {
        ...this.taskForm.value,
        id: this.taskId,
        createdAt: new Date(),
      };
      this.taskService.updateTask(updatedTask);

      const toast = await this.toastController.create({
        message: 'Tâche modifiée avec succès.',
        duration: 2000,
        color: 'success',
        position: 'bottom',
      });

      await toast.present();

      this.closeModal();
    }
  }

  async onDelete() {
    const alert = await this.alertController.create({
      header: 'Êtes-vous sûr ?',
      message: 'Cette action supprimera définitivement la tâche.',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        },
        {
          text: 'Supprimer',
          handler: async () => {
            if (this.taskId) {
              await this.taskService.deleteTask(this.taskId);

              const toast = await this.toastController.create({
                message: 'Tâche supprimée avec succès.',
                duration: 2000,
                color: 'danger',
                position: 'bottom',
              });

              await toast.present();

              this.closeModal();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
