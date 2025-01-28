import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { TaskStatus } from 'src/app/models/status.enum';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.page.html',
  styleUrls: ['./task-form.page.scss'],
  standalone: false,
})
export class TaskFormPage implements OnInit {
  taskForm: FormGroup;
  taskStatuses = Object.values(TaskStatus);

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(15)]],
      description: ['', [Validators.maxLength(64)]],
      status: [TaskStatus.TODO, Validators.required],
      dueDate: ['', [Validators.required, this.futureDateValidator]],
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.taskForm.valid) {
      this.taskService.addTask(this.taskForm.value);
      this.router.navigate(['/tasks']);
    }
  }

  private futureDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { invalidDate: true };
    }
    return null;
  }
} 