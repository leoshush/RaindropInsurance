import { TestBed } from '@angular/core/testing';

import { PremiumCalculator } from './premium-calculator';

describe('PremiumCalculator', () => {
  let service: PremiumCalculator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PremiumCalculator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
