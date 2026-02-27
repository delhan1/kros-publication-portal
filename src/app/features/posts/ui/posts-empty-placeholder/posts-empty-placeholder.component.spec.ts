import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsEmptyPlaceholderComponent } from './posts-empty-placeholder.component';

describe('PostsEmptyPlaceholderComponent', () => {
  let component: PostsEmptyPlaceholderComponent;
  let fixture: ComponentFixture<PostsEmptyPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsEmptyPlaceholderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostsEmptyPlaceholderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
