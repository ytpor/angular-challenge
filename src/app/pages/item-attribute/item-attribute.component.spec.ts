import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAttributeComponent } from './item-attribute.component';

describe('ItemAttributeComponent', () => {
  let component: ItemAttributeComponent;
  let fixture: ComponentFixture<ItemAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemAttributeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
