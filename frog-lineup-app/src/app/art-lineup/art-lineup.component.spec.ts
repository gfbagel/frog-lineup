import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtLineupComponent } from './art-lineup.component';

describe('ArtLineupComponent', () => {
  let component: ArtLineupComponent;
  let fixture: ComponentFixture<ArtLineupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtLineupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtLineupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
