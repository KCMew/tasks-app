import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { TaskStatus } from 'src/app/models/status.enum';
@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.page.html',
  styleUrls: ['./task-detail.page.scss'],
  standalone: false,
})
export class TaskDetailPage implements OnInit {
  taskForm: FormGroup;
  taskStatuses = Object.values(TaskStatus);
  taskId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      status: [TaskStatus.TODO, Validators.required],
      dueDate: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('id');
      if (this.taskId) {
        this.loadTask(this.taskId);
      }
    });
  }

  loadTask(id: string) {
    this.taskService.getTasks().subscribe(tasks => {
      const task = tasks.find(t => t.id === id);
      if (task) {
        this.taskForm.patchValue(task);
      }
    });
  }

  onSubmit() {
    if (this.taskForm.valid && this.taskId) {
      const updatedTask: Task = {
        ...this.taskForm.value,
        id: this.taskId,
        createdAt: new Date(),
      };
      this.taskService.updateTask(updatedTask);
      this.router.navigate(['/tasks']);
    }
  }

  onDelete() {
    if (this.taskId) {
      this.taskService.deleteTask(this.taskId);
      this.router.navigate(['/tasks']);
    }
  }
}
