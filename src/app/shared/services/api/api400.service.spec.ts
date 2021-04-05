import { TestBed } from '@angular/core/testing';

import { API400Service } from './api400.service';

describe('API400Service', () => {
  let service: API400Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(API400Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
