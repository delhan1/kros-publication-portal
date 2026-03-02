import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { Post } from '../../models/posts.model';

export interface PostsModifyDialogData {
  titleKey: string;
  confirmKey: string;
  post?: Post;
}

export interface PostsModifyDialogResultData {
  title: string;
  body: string;
}

@Component({
  selector: 'app-posts-add-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    TranslatePipe,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatError,
    MatLabel,
  ],
  templateUrl: './posts-modify-dialog.component.html',
  styleUrl: './posts-modify-dialog.component.scss',
})
export class PostsModifyDialogComponent {
  addCommentForm: FormGroup;
  readonly titleControl;
  readonly bodyControl;

  data: PostsModifyDialogData = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PostsModifyDialogComponent>);

  constructor() {
    this.addCommentForm = this.fb.group({
      title: [this.data.post?.title ?? '', [Validators.required, Validators.maxLength(255)]],
      body: [this.data.post?.body ?? '', [Validators.required]],
    });

    this.titleControl = this.addCommentForm.controls['title'];
    this.bodyControl = this.addCommentForm.controls['body'];
  }

  /**
   * Closes dialog with form values.
   */
  public submitHandler() {
    this.dialogRef.close(this.addCommentForm.value);
  }
}
