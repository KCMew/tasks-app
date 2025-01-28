import { TaskStatus } from 'src/app/models/status.enum';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: Date;
  createdAt: Date;
}

