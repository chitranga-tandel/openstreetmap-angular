import { TestBed } from '@angular/core/testing';

import { OsmTravelService } from './osm-travel.service';

describe('OsmTravelService', () => {
  let service: OsmTravelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OsmTravelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
