import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTideComponent } from './add-tide.component';

describe('AddTideComponent', () => {
  let component: AddTideComponent;
  let fixture: ComponentFixture<AddTideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
