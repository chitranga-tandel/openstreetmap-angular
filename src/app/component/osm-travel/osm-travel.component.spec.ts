import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsmTravelComponent } from './osm-travel.component';

describe('OsmTravelComponent', () => {
  let component: OsmTravelComponent;
  let fixture: ComponentFixture<OsmTravelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OsmTravelComponent]
    });
    fixture = TestBed.createComponent(OsmTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
