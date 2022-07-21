import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApprovalLevelComponent } from './add-approval-level.component';

describe('AddApprovalLevelComponent', () => {
  let component: AddApprovalLevelComponent;
  let fixture: ComponentFixture<AddApprovalLevelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddApprovalLevelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddApprovalLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
