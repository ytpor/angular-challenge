import { TestBed } from '@angular/core/testing';

import { HandsetService } from './handset.service';

describe('HandsetService', () => {
  let service: HandsetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandsetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
