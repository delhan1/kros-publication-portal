import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSnackbarComponent } from './info-snackbar.component';

describe('InfoSnackbarComponent', () => {
  let component: InfoSnackbarComponent;
  let fixture: ComponentFixture<InfoSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoSnackbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoSnackbarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
