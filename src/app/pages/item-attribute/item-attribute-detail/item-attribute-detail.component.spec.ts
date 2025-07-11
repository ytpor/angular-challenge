import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAttributeDetailComponent } from './item-attribute-detail.component';

describe('ItemAttributeDetailComponent', () => {
  let component: ItemAttributeDetailComponent;
  let fixture: ComponentFixture<ItemAttributeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemAttributeDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemAttributeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
