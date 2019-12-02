/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StadiumService } from './stadium.service';

describe('Service: Stadium', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StadiumService]
    });
  });

  it('should ...', inject([StadiumService], (service: StadiumService) => {
    expect(service).toBeTruthy();
  }));
});
