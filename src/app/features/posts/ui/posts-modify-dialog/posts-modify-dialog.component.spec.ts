import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsModifyDialogComponent } from './posts-modify-dialog.component';

describe('PostsAddDialogComponent', () => {
  let component: PostsModifyDialogComponent;
  let fixture: ComponentFixture<PostsModifyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsModifyDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostsModifyDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
