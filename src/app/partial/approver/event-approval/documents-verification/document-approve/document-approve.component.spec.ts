import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentApproveComponent } from './document-approve.component';

describe('DocumentApproveComponent', () => {
  let component: DocumentApproveComponent;
  let fixture: ComponentFixture<DocumentApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentApproveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
