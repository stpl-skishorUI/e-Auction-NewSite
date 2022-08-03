import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionPlotProfileComponent } from './auction-plot-profile.component';

describe('AuctionPlotProfileComponent', () => {
  let component: AuctionPlotProfileComponent;
  let fixture: ComponentFixture<AuctionPlotProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuctionPlotProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionPlotProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
