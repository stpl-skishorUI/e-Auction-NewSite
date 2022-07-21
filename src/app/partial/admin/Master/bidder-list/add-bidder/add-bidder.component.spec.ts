import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBidderComponent } from './add-bidder.component';

describe('AddBidderComponent', () => {
  let component: AddBidderComponent;
  let fixture: ComponentFixture<AddBidderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBidderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBidderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
