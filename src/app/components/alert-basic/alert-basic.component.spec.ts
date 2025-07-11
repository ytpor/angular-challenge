import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertBasicComponent } from './alert-basic.component';

describe('AlertBasicComponent', () => {
  let component: AlertBasicComponent;
  let fixture: ComponentFixture<AlertBasicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertBasicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
