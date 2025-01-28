import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { TasksPage } from './pages/tasks/tasks.page';
import { TaskFormPage } from './pages/task-form/task-form.page';
import { TaskFormPageModule } from './pages/task-form/task-form.module';
import { TasksPageModule } from './pages/tasks/tasks.module';
import { TaskDetailPage } from './pages/task-detail/task-detail.page';
import { TaskDetailPageModule } from './pages/task-detail/task-detail.module';
import { TaskGuard } from './guard/task.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full'
  },
  {
    path: 'tasks',
    component: TasksPage,
    canActivate: [TaskGuard],
  },
  {
    path: 'no-tasks',
    loadChildren: () =>
      import('./pages/no-task/no-task.module').then((m) => m.NoTaskPageModule),
  },
  {
    path: 'task-form',
    loadChildren: () => import('./pages/task-form/task-form.module').then(m => m.TaskFormPageModule)
  },
  {
    path: 'task-detail',
    loadChildren: () => import('./pages/task-detail/task-detail.module').then( m => m.TaskDetailPageModule)
  },
  {
    path: 'task-detail/:id',
    loadChildren: () => import('./pages/task-detail/task-detail.module').then( m => m.TaskDetailPageModule)
  },
  {
    path: 'no-task',
    loadChildren: () => import('./pages/no-task/no-task.module').then( m => m.NoTaskPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { } 