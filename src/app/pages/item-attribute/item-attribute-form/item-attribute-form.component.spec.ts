import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAttributeFormComponent } from './item-attribute-form.component';

describe('ItemAttributeFormComponent', () => {
  let component: ItemAttributeFormComponent;
  let fixture: ComponentFixture<ItemAttributeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemAttributeFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemAttributeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
