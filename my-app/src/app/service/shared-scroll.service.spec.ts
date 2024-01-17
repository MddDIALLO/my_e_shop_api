import { TestBed } from '@angular/core/testing';

import { SharedScrollService } from './shared-scroll.service';

describe('SharedScrollService', () => {
  let service: SharedScrollService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedScrollService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
