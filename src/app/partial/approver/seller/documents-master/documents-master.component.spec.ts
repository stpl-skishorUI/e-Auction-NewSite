import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsMasterComponent } from './documents-master.component';

describe('DocumentsMasterComponent', () => {
  let component: DocumentsMasterComponent;
  let fixture: ComponentFixture<DocumentsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentsMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
