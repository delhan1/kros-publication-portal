import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsShellComponent } from './posts-shell.component';

describe('PostsShellComponent', () => {
  let component: PostsShellComponent;
  let fixture: ComponentFixture<PostsShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostsShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
