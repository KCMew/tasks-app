import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoTaskPage } from './no-task.page';

describe('NoTaskPage', () => {
  let component: NoTaskPage;
  let fixture: ComponentFixture<NoTaskPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NoTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
