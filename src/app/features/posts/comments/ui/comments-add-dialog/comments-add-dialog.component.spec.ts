import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentsAddDialogComponent } from './comments-add-dialog.component';

describe('CommentsAddDialogComponent', () => {
  let component: CommentsAddDialogComponent;
  let fixture: ComponentFixture<CommentsAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentsAddDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentsAddDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
