import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TeamDetailsPage } from './team-details.page';

describe('TeamDetailsPage', () => {
  let component: TeamDetailsPage;
  let fixture: ComponentFixture<TeamDetailsPage>;

  beforeEach(waitForAsync () => {
    fixture = TestBed.createComponent(TeamDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
