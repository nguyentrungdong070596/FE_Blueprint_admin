import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonnuocComponent } from './monnuoc.component';

describe('MonnuocComponent', () => {
  let component: MonnuocComponent;
  let fixture: ComponentFixture<MonnuocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonnuocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonnuocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
