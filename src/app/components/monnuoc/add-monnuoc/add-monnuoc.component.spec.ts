import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMonnuocComponent } from './add-monnuoc.component';

describe('AddMonnuocComponent', () => {
  let component: AddMonnuocComponent;
  let fixture: ComponentFixture<AddMonnuocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMonnuocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMonnuocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
