import { TestBed } from '@angular/core/testing';

import { ItemAttributeService } from './item-attribute.service';

describe('ItemAttributeService', () => {
  let service: ItemAttributeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemAttributeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
