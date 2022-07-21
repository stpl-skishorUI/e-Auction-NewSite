import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotsUploadComponent } from './lots-upload.component';

describe('LotsUploadComponent', () => {
  let component: LotsUploadComponent;
  let fixture: ComponentFixture<LotsUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LotsUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LotsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
