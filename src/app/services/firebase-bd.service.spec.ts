import { TestBed } from '@angular/core/testing';

import { FirebaseBdService } from './firebase-bd.service';

describe('FirebaseBdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseBdService = TestBed.get(FirebaseBdService);
    expect(service).toBeTruthy();
  });
});
