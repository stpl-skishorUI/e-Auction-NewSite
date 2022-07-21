import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostAuctionLinksComponent } from './post-auction-links.component';

describe('PostAuctionLinksComponent', () => {
  let component: PostAuctionLinksComponent;
  let fixture: ComponentFixture<PostAuctionLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostAuctionLinksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostAuctionLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
