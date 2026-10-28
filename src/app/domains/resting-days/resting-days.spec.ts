import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestingDays } from './resting-days';

describe('RestingDays', () => {
  let component: RestingDays;
  let fixture: ComponentFixture<RestingDays>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestingDays],
    }).compileComponents();

    fixture = TestBed.createComponent(RestingDays);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
