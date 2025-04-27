import { TestBed } from '@angular/core/testing';

import { FlashAlertService } from './flash-alert.service';

describe('FlashAlertService', () => {
  let service: FlashAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlashAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
