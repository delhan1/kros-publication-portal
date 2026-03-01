import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsAddDialogComponent } from './posts-add-dialog.component';

describe('PostsAddDialogComponent', () => {
  let component: PostsAddDialogComponent;
  let fixture: ComponentFixture<PostsAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsAddDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostsAddDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
