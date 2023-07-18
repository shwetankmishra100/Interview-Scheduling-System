import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleInterviewComponent } from './schedule-interview.component';

describe('ScheduleInterviewComponent', () => {
  let component: ScheduleInterviewComponent;
  let fixture: ComponentFixture<ScheduleInterviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleInterviewComponent]
    });
    fixture = TestBed.createComponent(ScheduleInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
