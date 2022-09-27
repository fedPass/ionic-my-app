import { TestBed } from '@angular/core/testing';

import { DataFireService } from './data-fire.service';

describe('DataFireService', () => {
  let service: DataFireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataFireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
